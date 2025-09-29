"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/data/products";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/contexts/ToastContext";

export default function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<'mobile_money' | 'cash_on_delivery'>('mobile_money');
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "+256",
    region: "",
    district: "",
    landmark: "",
  });

  // Uganda regions and cities data
  const regions = [
    { id: '', label: 'Please select region', cities: [] },
    { id: '2', label: 'Eastern Region', cities: [
      { id: '430', label: 'Bugembe' }, { id: '49', label: 'Bugiri' }, { id: '53', label: 'Busia' },
      { id: '434', label: 'Buwenge' }, { id: '56', label: 'Iganga' }, { id: '436', label: 'Irundu' },
      { id: '57', label: 'Jinja' }, { id: '437', label: 'Kagulu' }, { id: '60', label: 'Kamuli' },
      { id: '435', label: 'Kidera' }, { id: '64', label: 'Kumi' }, { id: '69', label: 'Mbale' },
      { id: '429', label: 'Mbikko' }, { id: '438', label: 'Namungalwa' }, { id: '73', label: 'Pallisa' },
      { id: '74', label: 'Serere' }, { id: '75', label: 'Sironko' }, { id: '76', label: 'Soroti' },
      { id: '77', label: 'Tororo' },
    ]},
    { id: '8', label: 'Entebbe Area', cities: [
      { id: '257', label: 'Abayita Ababiri' }, { id: '408', label: 'Akright City - Entebbe' },
      { id: '258', label: 'Banga' }, { id: '259', label: 'Bugonga' }, { id: '260', label: 'Entebbe Market Area' },
      { id: '261', label: 'Entebbe Town' }, { id: '262', label: 'Katabi' }, { id: '362', label: 'Kisubi' },
      { id: '360', label: 'Kitala' }, { id: '402', label: 'Kitende' }, { id: '263', label: 'Kitoro' },
      { id: '264', label: 'Kitubulu' }, { id: '308', label: 'Kiwafu - entebbe' }, { id: '266', label: 'Lunyo' },
      { id: '267', label: 'Manyago' }, { id: '268', label: 'Nakiwogo' }, { id: '361', label: 'Namulanda' },
      { id: '269', label: 'Nkumba' }, { id: '270', label: 'Nsamizi' },
    ]},
    { id: '5', label: 'Kampala Region', cities: [
      { id: '213', label: 'Bakuli' }, { id: '172', label: 'Banda' }, { id: '174', label: 'Bugolobi' },
      { id: '176', label: 'Bukasa' }, { id: '197', label: 'Bukesa' }, { id: '146', label: 'Bukoto' },
      { id: '236', label: 'Bulenga' }, { id: '239', label: 'Bunamwaya' }, { id: '177', label: 'Bunga' },
      { id: '192', label: 'Busega' }, { id: '153', label: 'Butabika' }, { id: '237', label: 'Buwate' },
      { id: '178', label: 'Buziga' }, { id: '218', label: 'Bwaise' }, { id: '156', label: 'Bweyogerere' },
      { id: '231', label: 'Central Business District' }, { id: '310', label: 'Down Town Kampala' },
      { id: '179', label: 'Ggaba' }, { id: '180', label: 'Kabalagala' }, { id: '162', label: 'Kabojja' },
      { id: '214', label: 'Kabowa' }, { id: '191', label: 'Kabuusu' }, { id: '158', label: 'Kagoma' },
      { id: '219', label: 'Kalerwe' }, { id: '142', label: 'Kampala Industrial Area' }, { id: '139', label: 'Kamwokya' },
      { id: '181', label: 'Kansanga' }, { id: '224', label: 'Kanyanya' }, { id: '194', label: 'Kasubi' },
      { id: '182', label: 'Katwe' }, { id: '215', label: 'Kawaala' }, { id: '328', label: 'kawanda / Kagoma' },
      { id: '220', label: 'Kawempe' }, { id: '212', label: 'Kazo' }, { id: '241', label: 'Kibiri' },
      { id: '183', label: 'Kibuli' }, { id: '184', label: 'Kibuye' }, { id: '252', label: 'Kigowa' },
      { id: '225', label: 'Kikaya' }, { id: '254', label: 'Kikoni' }, { id: '253', label: 'Kinawataka' },
      { id: '238', label: 'Kira' }, { id: '155', label: 'Kireka' }, { id: '159', label: 'Kirinya' },
      { id: '152', label: 'Kirombe' }, { id: '221', label: 'Kisaasi' }, { id: '140', label: 'Kisenyi' },
      { id: '244', label: 'Kisugu' }, { id: '251', label: 'Kitante' }, { id: '195', label: 'Kitebi' },
      { id: '144', label: 'Kitintale' }, { id: '154', label: 'Kiwatule' }, { id: '138', label: 'Kololo' },
      { id: '168', label: 'Komamboga' }, { id: '169', label: 'Kulambiro' }, { id: '161', label: 'Kyaliwajjala' },
      { id: '170', label: 'Kyambogo' }, { id: '145', label: 'Kyanja' }, { id: '222', label: 'Kyebando' },
      { id: '235', label: 'Kyengera' }, { id: '163', label: 'Lubowa' }, { id: '216', label: 'Lubya' },
      { id: '164', label: 'Lugala' }, { id: '223', label: 'Lugoba' }, { id: '143', label: 'Lugogo' },
      { id: '200', label: 'Lusaze' }, { id: '242', label: 'Luwafu' }, { id: '151', label: 'Luzira' },
      { id: '165', label: 'Lweza' }, { id: '157', label: 'Maganjo' }, { id: '226', label: 'Makerere' },
      { id: '185', label: 'Makindye' }, { id: '201', label: 'Masanafu' }, { id: '247', label: 'Mbalwa' },
      { id: '147', label: 'Mbuya' }, { id: '229', label: 'Mengo' }, { id: '246', label: 'Mpanga' },
      { id: '227', label: 'Mpererwe' }, { id: '228', label: 'Mulago' }, { id: '186', label: 'Munyonyo' },
      { id: '203', label: 'Mutundwe' }, { id: '148', label: 'Mutungo' }, { id: '187', label: 'Muyenga' },
      { id: '249', label: 'Naalya' }, { id: '173', label: 'Nabisunsa' }, { id: '370', label: 'Nabweru' },
      { id: '171', label: 'Naguru' }, { id: '166', label: 'Najjanankumbi' }, { id: '167', label: 'Najjera' },
      { id: '136', label: 'Nakasero' }, { id: '149', label: 'Nakawa' }, { id: '141', label: 'Nakivubo' },
      { id: '208', label: 'Nalukolongo' }, { id: '314', label: 'Namasuba' }, { id: '196', label: 'Namirembe' },
      { id: '311', label: 'Namugongo' }, { id: '199', label: 'Namungoona' }, { id: '188', label: 'Namuwongo' },
      { id: '209', label: 'Nankulabye' }, { id: '233', label: 'Nansana' }, { id: '205', label: 'Nateete' },
      { id: '206', label: 'Ndeeba' }, { id: '189', label: 'Nsambya' }, { id: '150', label: 'Ntinda' },
      { id: '217', label: 'Nyanama' }, { id: '137', label: 'Old Kampala' }, { id: '204', label: 'Rubaga' },
      { id: '190', label: 'Salaama' }, { id: '248', label: 'Seguku' }, { id: '312', label: 'Sonde' },
      { id: '207', label: 'Wakaliga' }, { id: '211', label: 'Wandegeya' }, { id: '210', label: 'Wankulukuku' },
      { id: '230', label: 'Zana' },
    ]},
    { id: '3', label: 'Northern Region', cities: [
      { id: '80', label: 'Adjumani' }, { id: '87', label: 'Arua' }, { id: '89', label: 'Gulu' },
      { id: '427', label: 'Kalongo' }, { id: '91', label: 'Kitgum' }, { id: '92', label: 'Koboko' },
      { id: '96', label: 'Lira' }, { id: '99', label: 'Moyo' }, { id: '102', label: 'Nebbi' },
      { id: '105', label: 'Oyam' }, { id: '106', label: 'Pader' }, { id: '428', label: 'Patongo' },
    ]},
    { id: '7', label: 'Rest Of Central Region', cities: [
      { id: '431', label: 'Busunju' }, { id: '432', label: 'Bwikwe' }, { id: '294', label: 'Gayaza' },
      { id: '295', label: 'Kajjansi' }, { id: '433', label: 'Kalagi' }, { id: '297', label: 'Kasangati' },
      { id: '277', label: 'Kayunga' }, { id: '278', label: 'Kiboga' }, { id: '299', label: 'Kikajjo' },
      { id: '301', label: 'lugazi' }, { id: '280', label: 'Luweero' }, { id: '283', label: 'Masaka' },
      { id: '302', label: 'Matugga' }, { id: '284', label: 'Mityana' }, { id: '285', label: 'Mpigi' },
      { id: '286', label: 'Mubende' }, { id: '417', label: 'Mukono / Town Area' }, { id: '398', label: 'Namanve' },
      { id: '304', label: 'Nsangi' }, { id: '306', label: 'Nsasa' }, { id: '307', label: 'Seeta' },
      { id: '292', label: 'Wakiso' }, { id: '305', label: 'wampewo' },
    ]},
    { id: '4', label: 'Western Region', cities: [
      { id: '113', label: 'Bushenyi' }, { id: '405', label: 'Bweyale' }, { id: '114', label: 'Hoima' },
      { id: '115', label: 'Ibanda' }, { id: '117', label: 'Kabale' }, { id: '315', label: 'Kabarole (Fort Portal)' },
      { id: '387', label: 'Kagadi' }, { id: '121', label: 'Kasese' }, { id: '125', label: 'Kisoro' },
      { id: '126', label: 'Kyegegwa' }, { id: '127', label: 'Kyenjojo' }, { id: '128', label: 'Masindi' },
      { id: '129', label: 'Mbarara' },
    ]},
  ];

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const regionId = e.target.value;
    setForm({ ...form, region: regionId, district: '' });
  };
  const router = useRouter();
  const { success, error, info } = useToast();

  const validUGPhone = /^\+256\d{9}$/; // e.g. +2567XXXXXXXX

  const handleMobileMoneyPayment = async () => {
    try {
      info("Processing payment...", "Please wait while we initiate your mobile money payment.");
      
      const tx_ref = `yourduuka-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      const response = await fetch('/api/flutterwave', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone_number: form.phone.replace('+', ''),
          amount: subtotal,
          email: form.email,
          customer_name: form.name,
          tx_ref: tx_ref,
          customer_address: {
            region: regions.find(r => r.id === form.region)?.label || '',
            district: regions.find(r => r.id === form.region)?.cities.find(c => c.id === form.district)?.label || '',
            landmark: form.landmark
          }
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        success(
          "Payment initiated!", 
          "Please complete the payment on your mobile device. You will be redirected shortly."
        );
        // Redirect to Flutterwave payment page
        if (data.redirect_url) {
          setTimeout(() => {
            window.location.href = data.redirect_url;
          }, 2000);
        }
      } else {
        throw new Error(data.error || 'Payment initiation failed');
      }
    } catch (err: any) {
      error("Payment failed", err.message || "Unable to process mobile money payment. Please try again.");
    }
  };

  const onPay = async () => {
    setMessage("");
    if (!validUGPhone.test(form.phone)) {
      setMessage("Enter a valid Ugandan phone number in +256 format (e.g., +2567XXXXXXXX)");
      error("Invalid phone number", "Please enter a valid Ugandan phone number");
      return;
    }
    if (!form.name || !form.email || !form.region || !form.district || !form.landmark) {
      setMessage("Please fill in all required fields");
      error("Missing information", "Please fill in all required fields");
      return;
    }
    
    // Force Mobile Money payment - Cash on Delivery is disabled
    if (paymentMethod !== 'mobile_money') {
      setMessage("Mobile Money payment is required. Cash on Delivery is currently unavailable.");
      error("Payment method unavailable", "Please use Mobile Money payment to complete your order.");
      return;
    }
    
    await handleMobileMoneyPayment();
    return;

    // Legacy cash on delivery code (disabled)
    /*
    try {
      setProcessing(true);
      const customer = {
        name: form.name.trim(),
        email: form.email,
        phone: form.phone,
        address: {
          line1: form.landmark, // Delivery address is the nearest landmark
          district: form.district,
          landmark: form.landmark,
        },
      };

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, customer }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.url) {
        // Let external checkout handle redirect
        window.location.href = data.url;
        return;
      }

      // Fallback: locally persist order via Service Worker and localStorage
      const order = {
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        items,
        subtotal,
        customer,
        status: "placed",
      };
      try {
        if (navigator?.serviceWorker?.controller) {
          navigator.serviceWorker.controller.postMessage({ type: "SAVE_ORDER", payload: order });
        }
      } catch {}
      try {
        const prev = JSON.parse(localStorage.getItem("orders") || "[]");
        localStorage.setItem("orders", JSON.stringify([order, ...prev]));
      } catch {}

      clear();
      success("Order placed!", "Your order has been placed successfully. You will receive a confirmation shortly.");
      router.push("/success");
    } catch (e) {
      setMessage("Checkout failed. Please try again.");
    } finally {
      setProcessing(false);
    }
    */
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
      <section className="lg:col-span-2 space-y-4">
        <h1 className="text-2xl font-semibold">Checkout</h1>
        {message ? (
          <div className="rounded border bg-amber-50 text-amber-900 px-3 py-2 text-sm">{message}</div>
        ) : null}
        <form className="grid grid-cols-1 sm:grid-cols-2 gap-4" onSubmit={(e) => e.preventDefault()}>
          <input
            className="sm:col-span-2 rounded border bg-background px-3 py-2"
            placeholder="Full name"
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
          <input
            className="sm:col-span-2 rounded border bg-background px-3 py-2"
            placeholder="Email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          />
          <input
            className="sm:col-span-2 rounded border bg-background px-3 py-2"
            placeholder="Phone (Uganda +2567XXXXXXXX)"
            required
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
          />
          <select
            className="rounded border bg-background px-3 py-2"
            required
            value={form.region}
            onChange={handleRegionChange}
          >
            {regions.map((region) => (
              <option key={region.id} value={region.id} disabled={region.id === ''}>
                {region.label}
              </option>
            ))}
          </select>
          <select
            className="rounded border bg-background px-3 py-2"
            required
            value={form.district}
            onChange={(e) => setForm((f) => ({ ...f, district: e.target.value }))}
          >
            <option value="" disabled>Select your district/city</option>
            {form.region && regions.find(r => r.id === form.region)?.cities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.label}
              </option>
            ))}
          </select>
          <input
            className="rounded border bg-background px-3 py-2"
            placeholder="Nearest landmark (Delivery address)"
            required
            value={form.landmark}
            onChange={(e) => setForm((f) => ({ ...f, landmark: e.target.value }))}
          />
        </form>
        
        {/* Payment Method Selection */}
        <div className="mt-6">
          <h3 className="font-medium mb-3">Payment Method</h3>
          <div className="space-y-3">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="paymentMethod"
                value="mobile_money"
                checked={paymentMethod === 'mobile_money'}
                onChange={(e) => setPaymentMethod(e.target.value as 'mobile_money')}
                className="text-blue-600"
              />
              <div>
                <div className="font-medium text-sm">Uganda Mobile Money</div>
                <div className="text-xs text-muted-foreground">Pay with MTN Money or Airtel Money</div>
              </div>
            </label>
            <label className="flex items-center space-x-3 cursor-not-allowed opacity-50">
              <input
                type="radio"
                name="paymentMethod"
                value="cash_on_delivery"
                checked={false}
                disabled={true}
                className="text-gray-400 cursor-not-allowed"
              />
              <div>
                <div className="font-medium text-sm text-gray-500">Cash on Delivery</div>
                <div className="text-xs text-muted-foreground">Currently unavailable - Mobile Money payments only</div>
              </div>
            </label>
          </div>
        </div>
      </section>

      <aside className="h-fit rounded-lg border p-4">
        <h2 className="font-medium">Order Summary</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {items.map((i) => (
            <li key={i.id} className="flex justify-between">
              <span>
                {i.name} × {i.qty}
              </span>
              <span>{formatPrice(i.price * i.qty)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-between font-medium">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <button
          disabled={processing || items.length === 0}
          onClick={onPay}
          className="mt-4 inline-flex w-full items-center justify-center rounded-md bg-foreground text-background px-4 py-2 hover:opacity-90 disabled:opacity-60"
        >
          {processing ? "Processing..." : "Pay with Mobile Money"}
        </button>
        <p className="text-xs text-muted-foreground mt-2">No account required. Your order is saved securely on this device.</p>
        <Link className="mt-3 inline-block text-sm underline" href="/cart">Back to cart</Link>
      </aside>
    </main>
  );
}