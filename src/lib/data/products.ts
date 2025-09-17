export type Product = {
  id: string;
  slug: string;
  name: string;
  price: number; // in UGX (Ugandan Shillings)
  category: "epl" | "facial";
  images: string[];
  shortDescription: string;
  description: string;
  specs: { label: string; value: string }[];
};

export const products: Product[] = [
  {
    id: "p-facial-001",
    slug: "philips-5000-series-facial-hair-remover-brr454-00",
    name: "Philips 5000 Series Facial Hair Remover BRR454/00",
    price: 82484,
    category: "facial",
    images: [
      "https://m.media-amazon.com/images/I/51dC16+uGFL._AC_UF1000,1000_QL80_FMwebp_.jpg",
      "https://m.media-amazon.com/images/I/7166bSmhR9L._AC_UF1000,1000_QL80_FMwebp_.jpg",
      "https://m.media-amazon.com/images/I/71JW0OObXOL._AC_UF1000,1000_QL80_FMwebp_.jpg",
      "https://m.media-amazon.com/images/I/71h2M3aRjBL._AC_UF1000,1000_QL80_FMwebp_.jpg",
      "https://m.media-amazon.com/images/I/61l3cNjjv8L._AC_UF1000,1000_QL80_FMwebp_.jpg",
      "https://m.media-amazon.com/images/I/61KQOccW4dL._AC_UF1000,1000_QL80_FMwebp_.jpg",
      "https://m.media-amazon.com/images/I/61fBycQRI3L._AC_UF1000,1000_QL80_FMwebp_.jpg",
      "https://m.media-amazon.com/images/I/61IIwgGJoBL._AC_UF1000,1000_QL80_FMwebp_.jpg",
      "https://m.media-amazon.com/images/I/61GUFvpxdqL._AC_UF1000,1000_QL80_FMwebp_.jpg",
      "https://m.media-amazon.com/images/I/61IzWprgojL._AC_UF1000,1000_QL80_FMwebp_.jpg"
    ],
    shortDescription: "Beautifully smooth skin with built-in mirror and full circle LED light.",
    description:
      "Beautifully smooth skin on the go for upper lip, chin, and cheeks. Built-in mirror, full circle LED-light, compact and portable. Designed to give results without pain.",
    specs: [
      { label: "Color", value: "Lychee Pink" },
      { label: "Model", value: "BRR454/00" }
    ]
  },
  {
    id: "p-facial-002",
    slug: "rechargeable-facial-hair-remover-women-2-in-1-gold",
    name: "Rechargeable Facial Hair Remover for Women (2-in-1, Gold)",
    price: 74714,
    category: "facial",
    images: [
      "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcc4f?q=80&w=1400&auto=format&fit=crop"
    ],
    shortDescription: "2-in-1 facial hair remover and eyebrow trimmer with LED light.",
    description:
      "Ingeniously designed 2-in-1 device removes face and eyebrow hair. Smooth and pain-free circular motion technique removes even the finest hairs. Portable and discreet, with enhanced Type-C charging and built-in LED light.",
    specs: [
      { label: "Charging", value: "Type-C Rechargeable" },
      { label: "Included", value: "Facial remover + Eyebrow trimmer" },
      { label: "Warranty", value: "60-day return & lifetime guarantee" }
    ]
  },
  {
    id: "p-epl-001",
    slug: "beroza-ipl-laser-hair-removal-999999-flash-white",
    name: "BEROZA Laser Hair Removal Device (IPL, 999,999 Flash)",
    price: 65968,
    category: "epl",
    images: [
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=1400&auto=format&fit=crop"
    ],
    shortDescription: "IPL device with cooling system, 5 energy levels, 2 flash modes.",
    description:
      "Upgraded freezing point function keeps skin contact around 10℃ for painless sessions. Features 5 adjustable energy levels and Manual/Auto flash modes for different body areas. Gentle, safe, and easy to use with large LCD display.",
    specs: [
      { label: "Energy Levels", value: "5" },
      { label: "Flash Modes", value: "Manual & Auto" },
      { label: "Cooling", value: "Freezing point ~10℃" }
    ]
  },
  {
    id: "p-facial-003",
    slug: "braun-face-mini-hair-remover-fs1000",
    name: "Braun Face Mini Hair Remover FS1000",
    price: 76832,
    category: "facial",
    images: [
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=1400&auto=format&fit=crop"
    ],
    shortDescription: "Electric facial hair removal for women—smooth, gentle, and precise.",
    description:
      "Shaves hair cleanly and close to the skin for easier makeup application. Gentle and discreet, mini-sized for portability. Built-in smartlight for precise hair spotting on tricky facial areas.",
    specs: [
      { label: "Model", value: "FS1000" },
      { label: "Features", value: "Smartlight, mini-sized, gentle" }
    ]
  }
];

export function formatPrice(amountUGX: number) {
  return new Intl.NumberFormat("en-UG", { style: "currency", currency: "UGX", maximumFractionDigits: 0 }).format(amountUGX);
}