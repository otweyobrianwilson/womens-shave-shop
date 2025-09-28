import { NextRequest, NextResponse } from "next/server";

const Flutterwave = require('flutterwave-node-v3');

const flw = new Flutterwave(
  process.env.NEXT_PUBLIC_FLW_PUBLIC_KEY || "FLWPUBK_TEST-6e86758087d4aa6b12834610e8683dc0-X",
  process.env.FLW_SECRET_KEY || "FLWSECK_TEST-8c5fb43c48442836765d119a1a07142f-X"
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone_number, amount, email, customer_name, tx_ref } = body;

    // Validate required fields
    if (!phone_number || !amount || !email || !tx_ref) {
      return NextResponse.json(
        { error: "Missing required fields: phone_number, amount, email, tx_ref" },
        { status: 400 }
      );
    }

    // Validate Uganda phone number format (256XXXXXXXXX, 12 digits total)
    const cleanPhone = phone_number.replace(/\D/g, '');
    if (!cleanPhone.startsWith('256') || cleanPhone.length !== 12) {
      return NextResponse.json(
        { error: "Phone number must be in Uganda format (256XXXXXXXXX)" },
        { status: 400 }
      );
    }

    // Determine network based on phone number
    let network = "MTN";
    const prefix = cleanPhone.substring(3, 6); // Get digits after 256
    
    // Airtel Uganda prefixes: 70, 74, 75, 20
    if (['070', '074', '075', '020'].some(p => prefix === p)) {
      network = "AIRTEL";
    }

    const payload = {
      phone_number: cleanPhone,
      network: network,
      amount: amount,
      currency: 'UGX',
      email: email,
      tx_ref: tx_ref,
      fullname: customer_name || 'yourduuka Customer',
    };

    console.log('Flutterwave payload:', payload);

    const response = await flw.MobileMoney.uganda(payload);
    
    console.log('Flutterwave response:', response);

    if (response.status === 'success') {
      return NextResponse.json({
        success: true,
        data: response,
        redirect_url: response.meta?.authorization?.redirect
      });
    } else {
      return NextResponse.json(
        { error: response.message || "Payment initiation failed" },
        { status: 400 }
      );
    }

  } catch (error: any) {
    console.error('Flutterwave error:', error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}