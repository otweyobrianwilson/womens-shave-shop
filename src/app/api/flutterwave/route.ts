import { NextRequest, NextResponse } from "next/server";

// Use environment variables for API keys
const FLW_SECRET_KEY = process.env.FLW_SECRET_KEY;
const FLW_PUBLIC_KEY = process.env.NEXT_PUBLIC_FLW_PUBLIC_KEY;

if (!FLW_SECRET_KEY) {
  throw new Error('FLW_SECRET_KEY environment variable is required');
}

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

    // Extract client IP more reliably
    const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                     request.headers.get('x-real-ip') || 
                     request.headers.get('cf-connecting-ip') || 
                     '154.123.220.1'; // Default IP as per Flutterwave docs

    const payload = {
      phone_number: cleanPhone,
      network: network,
      amount: amount,
      currency: 'UGX',
      email: email,
      tx_ref: tx_ref,
      order_id: `yourduuka-order-${tx_ref}`,
      fullname: customer_name || 'yourduuka Customer',
      client_ip: clientIp,
      device_fingerprint: `web-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      redirect_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/success`
    };

    console.log('Flutterwave payload:', payload);

    // Make direct API call to Flutterwave
    const flutterwaveResponse = await fetch('https://api.flutterwave.com/v3/charges?type=mobile_money_uganda', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${FLW_SECRET_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const response = await flutterwaveResponse.json();
    
    console.log('Flutterwave response:', response);
    console.log('Flutterwave response status:', flutterwaveResponse.status);

    if (flutterwaveResponse.ok && response.status === 'success') {
      return NextResponse.json({
        success: true,
        data: response,
        redirect_url: response.meta?.authorization?.redirect
      });
    } else {
      console.error('Flutterwave error response:', response);
      return NextResponse.json(
        { error: response.message || "Payment initiation failed" },
        { status: flutterwaveResponse.status || 400 }
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