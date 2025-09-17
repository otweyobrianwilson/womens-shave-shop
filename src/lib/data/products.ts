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
    name: "Rechargeable Facial Hair Remover for Women: 2 in 1 Electric Eyebrow and Facial Hair Remover - Suitable for Middle-aged Women's Eyebrow, Chin, and Cheek Trimming - with Built-in LED Light (Gold)",
    price: 74714,
    category: "facial",
    images: [
      "https://m.media-amazon.com/images/I/71cPSM+DgcL._AC_SL1500_.jpg",
      "https://m.media-amazon.com/images/I/71UwR-mvKBL._AC_SL1500_.jpg",
      "https://m.media-amazon.com/images/I/71CElco2HLL._AC_SL1500_.jpg",
      "https://m.media-amazon.com/images/I/61iI9I1qwUL._AC_SL1500_.jpg",
      "https://m.media-amazon.com/images/I/612crzDBLxL._AC_SL1500_.jpg",
      "https://m.media-amazon.com/images/I/61CFcnWe9qL._AC_SL1500_.jpg",
      "https://m.media-amazon.com/images/I/61DU4jMhhTL._AC_SL1500_.jpg",
      "https://m.media-amazon.com/images/I/71yNDgVT4vL._AC_SL1500_.jpg"
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
    name: "BEROZA Laser hair removal device, 999,999 flash permanent hair removal device, IPL freezing point painless hair removal, unisex stimulation hair removal device. (White)",
    price: 65968,
    category: "epl",
    images: [
      "https://m.media-amazon.com/images/I/61XyrZp7wAL._AC_SL1500_.jpg",
      "https://m.media-amazon.com/images/I/61eCxIp2rcL._AC_SL1500_.jpg",
      "https://m.media-amazon.com/images/I/61oCGgXFAWL._AC_SL1500_.jpg",
      "https://m.media-amazon.com/images/I/61a2KJlCDyL._AC_SL1500_.jpg",
      "https://m.media-amazon.com/images/I/71NBFHMiA+L._AC_SL1500_.jpg",
      "https://m.media-amazon.com/images/I/61Ez2Vp3AIL._AC_SL1500_.jpg"
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
    name: "Braun Face Mini Hair Remover FS1000, Electric Facial Hair Removal for Women",
    price: 76832,
    category: "facial",
    images: [
      "https://m.media-amazon.com/images/I/71wh0LwjU-L._AC_SL1500_.jpg",
      "https://m.media-amazon.com/images/I/617wPBFAYyL._AC_SL1500_.jpg",
      "https://m.media-amazon.com/images/I/81XIMBd4y3L._AC_SL1500_.jpg",
      "https://m.media-amazon.com/images/I/81URtG2Zk3L._AC_SL1500_.jpg",
      "https://m.media-amazon.com/images/I/71hniUZAsoL._AC_SL1500_.jpg",
      "https://m.media-amazon.com/images/I/61SFo1zusZL._AC_SL1500_.jpg",
      "https://m.media-amazon.com/images/I/61xro+RQLpL._AC_SL1500_.jpg",
      "https://m.media-amazon.com/images/I/81wGkV11URL._AC_SL1500_.jpg"
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