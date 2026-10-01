import hero from "@/assets/hero.jpg";
import frame from "@/assets/frame.jpg";
import mug from "@/assets/mug.jpg";
import album from "@/assets/album.jpg";
import gift from "@/assets/gift.jpg";
import prewedding from "@/assets/prewedding.jpg";
import birthday from "@/assets/birthday.jpg";
import family from "@/assets/family.jpg";

export const images = { hero, frame, mug, album, gift, prewedding, birthday, family };

export const BRAND = {
  name: "Aurelia Studio",
  city: "Jaipur",
  phone: "+91 98765 43210",
  whatsapp: "919876543210",
  email: "hello@aureliastudio.in",
  address: "12 MI Road, Jaipur, Rajasthan 302001",
};

export const inr = (n: number) => "₹" + n.toLocaleString("en-IN");

export type Service = {
  id: string; name: string; image: string; blurb: string; from: number; duration: string; includes: string[];
};
export const services: Service[] = [
  { id: "wedding", name: "Wedding Photography", image: hero, blurb: "Candid and traditional coverage of every ritual, from haldi to vidaai.", from: 75000, duration: "1–3 days", includes: ["2 photographers", "500+ edited photos", "Online gallery", "Premium album"] },
  { id: "pre-wedding", name: "Pre-Wedding", image: prewedding, blurb: "A cinematic story shoot at a location that feels like you two.", from: 25000, duration: "Half day", includes: ["2 outfits", "100 edited photos", "1-min teaser reel"] },
  { id: "engagement", name: "Engagement", image: hero, blurb: "Ring ceremony coverage with portraits of the couple and family.", from: 20000, duration: "4–6 hours", includes: ["1 photographer", "250 edited photos", "Online gallery"] },
  { id: "birthday", name: "Birthday", image: birthday, blurb: "Joyful, unposed moments from cake-cutting to the last balloon.", from: 9999, duration: "3 hours", includes: ["1 photographer", "150 edited photos", "Same-week delivery"] },
  { id: "family", name: "Baby & Family", image: family, blurb: "Calm studio or home sessions for newborns and growing families.", from: 7999, duration: "2 hours", includes: ["Studio props", "40 retouched portraits", "1 framed print"] },
  { id: "events", name: "Events & Functions", image: birthday, blurb: "Corporate events, festivals, housewarmings and anniversaries.", from: 12000, duration: "Per event", includes: ["1–2 photographers", "Fast turnaround", "Highlights selection"] },
  { id: "photo-video", name: "Photo + Video", image: prewedding, blurb: "Complete photo and cinematic film coverage with drone.", from: 150000, duration: "2–3 days", includes: ["Photo + film team", "Drone footage", "Highlight film", "2 albums"] },
];

export const packages = [
  { name: "Essential", price: 75000, note: "1 day · 1 photographer · 300 photos · online gallery", featured: false },
  { name: "Signature", price: 145000, note: "2 days · 2 photographers · 600 photos · album · teaser film", featured: true },
  { name: "Heirloom", price: 260000, note: "3 days · photo + film · drone · 2 albums · pre-wedding shoot", featured: false },
];

export type Category = "Photo Frames" | "Photo Mugs" | "Photo Albums" | "Personalized Gifts" | "Templates";
export const categories: Category[] = ["Photo Frames", "Photo Mugs", "Photo Albums", "Personalized Gifts", "Templates"];

export type Product = {
  id: string; name: string; category: Category; price: number; mrp?: number; image: string; note: string;
  rating: number; reviews: number; sizes?: string[]; customizable: boolean; isNew?: boolean; best?: boolean; stock: number;
};
export const products: Product[] = [
  { id: "walnut-frame", name: "Walnut Frame", category: "Photo Frames", price: 1499, mrp: 1999, image: frame, note: "Engraved date & names", rating: 4.9, reviews: 212, sizes: ["5×7", "8×10", "12×15"], customizable: true, best: true, stock: 40 },
  { id: "memory-mug", name: "Memory Mug", category: "Photo Mugs", price: 599, image: mug, note: "Full-color photo print", rating: 4.8, reviews: 418, sizes: ["330 ml", "450 ml"], customizable: true, best: true, stock: 120 },
  { id: "heirloom-album", name: "Heirloom Album", category: "Photo Albums", price: 8999, mrp: 10999, image: album, note: "60 pages · linen cover", rating: 4.9, reviews: 96, sizes: ["10×10", "12×12"], customizable: true, stock: 15 },
  { id: "gift-canvas", name: "Gift Canvas", category: "Personalized Gifts", price: 2299, image: gift, note: "Ready-to-gift packaging", rating: 4.7, reviews: 133, sizes: ["8×8", "12×12"], customizable: true, isNew: true, stock: 25 },
  { id: "classic-frame", name: "Classic Gallery Frame", category: "Photo Frames", price: 999, image: frame, note: "Matte white mount", rating: 4.6, reviews: 88, sizes: ["5×7", "8×10"], customizable: true, isNew: true, stock: 60 },
  { id: "couple-mug", name: "Couple Mug Set", category: "Photo Mugs", price: 1099, image: mug, note: "Set of two, names printed", rating: 4.8, reviews: 74, customizable: true, isNew: true, stock: 35 },
  { id: "mini-album", name: "Mini Keepsake Album", category: "Photo Albums", price: 2499, image: album, note: "24 pages · pocket size", rating: 4.7, reviews: 51, customizable: true, stock: 30 },
  { id: "wedding-template", name: "Wedding Collage Template", category: "Templates", price: 499, image: gift, note: "Pre-designed layout, add your photos", rating: 4.5, reviews: 39, customizable: true, stock: 999 },
];

export type PortfolioItem = { id: number; src: string; cat: string; title: string; tall?: boolean };
export const portfolioCats = ["All", "Wedding", "Pre-wedding", "Events", "Portraits", "Family"];
export const portfolio: PortfolioItem[] = [
  { id: 1, src: hero, cat: "Wedding", title: "Ananya & Rohan · Udaipur", tall: true },
  { id: 2, src: prewedding, cat: "Pre-wedding", title: "Golden hour · Pushkar", tall: true },
  { id: 3, src: birthday, cat: "Events", title: "Myra turns 7" },
  { id: 4, src: family, cat: "Family", title: "Welcome, baby Aarav", tall: true },
  { id: 5, src: hero, cat: "Portraits", title: "Bridal portrait" },
  { id: 6, src: prewedding, cat: "Pre-wedding", title: "Fields of Amer" },
  { id: 7, src: family, cat: "Portraits", title: "Studio session" },
  { id: 8, src: birthday, cat: "Events", title: "Sangeet night" , tall: true },
];

export const testimonials = [
  { quote: "They captured our wedding like a film. The album still makes our parents cry.", name: "Ananya & Rohan", place: "Udaipur" },
  { quote: "Ordered 12 photo mugs for the family — perfect print quality and delivered in 4 days.", name: "Priya Sharma", place: "Jaipur" },
  { quote: "Calm, patient and so good with our newborn. The framed print is on our wall.", name: "Kavya & Arjun", place: "Delhi" },
];

export const mockOrders = [
  { id: "AU-10482", customer: "Priya Sharma", date: "28 Sep 2026", total: 2397, status: "Shipped", items: 3 },
  { id: "AU-10481", customer: "Rahul Mehta", date: "27 Sep 2026", total: 8999, status: "Processing", items: 1 },
  { id: "AU-10479", customer: "Sneha Iyer", date: "26 Sep 2026", total: 1499, status: "Delivered", items: 1 },
  { id: "AU-10475", customer: "Vikram Singh", date: "24 Sep 2026", total: 3398, status: "Pending", items: 2 },
];
export const mockBookings = [
  { id: "BK-2207", customer: "Ananya Kapoor", service: "Wedding Photography", date: "14 Nov 2026", status: "Confirmed", amount: 145000 },
  { id: "BK-2206", customer: "Rohit Jain", service: "Pre-Wedding", date: "20 Oct 2026", status: "Pending", amount: 25000 },
  { id: "BK-2203", customer: "Meera Nair", service: "Baby & Family", date: "08 Oct 2026", status: "Confirmed", amount: 7999 },
];
