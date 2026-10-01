import type { Order, Booking, Address, Review, TimeSlot } from "./types";
import { images } from "./data";

// ─── Mock Orders ────────────────────────────────────────────────────────
export const mockUserOrders: Order[] = [
  {
    id: "AU-10482",
    userId: "u1",
    customerName: "Priya Sharma",
    customerPhone: "9876543210",
    customerEmail: "priya@email.com",
    items: [
      { id: "oi1", productId: "walnut-frame", name: "Walnut Frame", image: images.frame, price: 1499, qty: 2, size: "8×10", customText: "Ananya & Rohan · 2026" },
      { id: "oi2", productId: "memory-mug", name: "Memory Mug", image: images.mug, price: 599, qty: 1, size: "330 ml" },
    ],
    address: { id: "a1", userId: "u1", label: "Home", name: "Priya Sharma", phone: "9876543210", line1: "42 MI Road", city: "Jaipur", state: "Rajasthan", pincode: "302001", isDefault: true },
    subtotal: 3597,
    shipping: 0,
    total: 3597,
    status: "Shipped",
    paymentMethod: "upi",
    paymentStatus: "paid",
    trackingId: "IND9273648102",
    createdAt: "2026-09-28T10:30:00Z",
    updatedAt: "2026-09-29T14:00:00Z",
  },
  {
    id: "AU-10479",
    userId: "u1",
    customerName: "Priya Sharma",
    customerPhone: "9876543210",
    customerEmail: "priya@email.com",
    items: [
      { id: "oi3", productId: "heirloom-album", name: "Heirloom Album", image: images.album, price: 8999, qty: 1, size: "12×12" },
    ],
    address: { id: "a1", userId: "u1", label: "Home", name: "Priya Sharma", phone: "9876543210", line1: "42 MI Road", city: "Jaipur", state: "Rajasthan", pincode: "302001", isDefault: true },
    subtotal: 8999,
    shipping: 0,
    total: 8999,
    status: "Delivered",
    paymentMethod: "card",
    paymentStatus: "paid",
    createdAt: "2026-09-15T08:00:00Z",
    updatedAt: "2026-09-21T11:00:00Z",
  },
  {
    id: "AU-10465",
    userId: "u1",
    customerName: "Priya Sharma",
    customerPhone: "9876543210",
    customerEmail: "priya@email.com",
    items: [
      { id: "oi4", productId: "gift-canvas", name: "Gift Canvas", image: images.gift, price: 2299, qty: 1, size: "12×12", customText: "Happy Birthday, Mom!" },
    ],
    address: { id: "a2", userId: "u1", label: "Mom's Place", name: "Sunita Sharma", phone: "9876543211", line1: "18 Tonk Road", city: "Jaipur", state: "Rajasthan", pincode: "302015", isDefault: false },
    subtotal: 2299,
    shipping: 0,
    total: 2299,
    status: "Processing",
    paymentMethod: "cod",
    paymentStatus: "pending",
    createdAt: "2026-09-30T15:00:00Z",
    updatedAt: "2026-09-30T15:00:00Z",
  },
];

// ─── Mock Bookings ──────────────────────────────────────────────────────
export const mockUserBookings: Booking[] = [
  {
    id: "BK-2207",
    userId: "u1",
    customerName: "Priya Sharma",
    customerPhone: "9876543210",
    customerEmail: "priya@email.com",
    serviceId: "wedding",
    serviceName: "Wedding Photography",
    packageName: "Signature",
    date: "2026-11-14",
    timeSlot: "Full day",
    location: "Fairmont, Jaipur",
    notes: "Bride entry at 6 PM, please arrive by 4 PM for room shots.",
    amount: 145000,
    status: "Confirmed",
    paymentStatus: "partial",
    createdAt: "2026-08-20T10:00:00Z",
  },
  {
    id: "BK-2201",
    userId: "u1",
    customerName: "Priya Sharma",
    customerPhone: "9876543210",
    serviceId: "family",
    serviceName: "Baby & Family",
    date: "2026-09-05",
    timeSlot: "10:00 AM – 12:00 PM",
    location: "Aurelia Studio, Jaipur",
    amount: 7999,
    status: "Completed",
    paymentStatus: "paid",
    createdAt: "2026-08-25T09:00:00Z",
  },
  {
    id: "BK-2210",
    userId: "u1",
    customerName: "Priya Sharma",
    customerPhone: "9876543210",
    serviceId: "pre-wedding",
    serviceName: "Pre-Wedding",
    packageName: "Pre-Wedding",
    date: "2026-10-20",
    timeSlot: "4:00 PM – 7:00 PM",
    location: "Amer Fort, Jaipur",
    amount: 25000,
    status: "Pending",
    paymentStatus: "pending",
    createdAt: "2026-09-28T11:00:00Z",
  },
];

// ─── Mock Addresses ─────────────────────────────────────────────────────
export const mockAddresses: Address[] = [
  {
    id: "a1",
    userId: "u1",
    label: "Home",
    name: "Priya Sharma",
    phone: "9876543210",
    line1: "42 MI Road, Near Panch Batti",
    city: "Jaipur",
    state: "Rajasthan",
    pincode: "302001",
    isDefault: true,
  },
  {
    id: "a2",
    userId: "u1",
    label: "Mom's Place",
    name: "Sunita Sharma",
    phone: "9876543211",
    line1: "18 Tonk Road, Lalkothi",
    city: "Jaipur",
    state: "Rajasthan",
    pincode: "302015",
    isDefault: false,
  },
];

// ─── Mock Reviews ───────────────────────────────────────────────────────
export const mockReviews: Review[] = [
  { id: "r1", productId: "walnut-frame", userId: "u2", userName: "Meera Nair", rating: 5, comment: "The engraving is beautiful. Perfect anniversary gift.", createdAt: "2026-09-10T08:00:00Z" },
  { id: "r2", productId: "walnut-frame", userId: "u3", userName: "Vikram Singh", rating: 5, comment: "Solid wood, arrived well-packed. Print quality is excellent.", createdAt: "2026-09-05T12:00:00Z" },
  { id: "r3", productId: "memory-mug", userId: "u4", userName: "Sneha Iyer", rating: 4, comment: "Vivid colours, dishwasher safe. Slightly smaller than expected.", createdAt: "2026-09-12T07:00:00Z" },
  { id: "r4", productId: "heirloom-album", userId: "u5", userName: "Rahul Mehta", rating: 5, comment: "This album is stunning. Worth every rupee.", createdAt: "2026-08-20T09:00:00Z" },
  { id: "r5", productId: "gift-canvas", userId: "u6", userName: "Ananya Kapoor", rating: 5, comment: "Mom loved it! The print quality is gallery-worthy.", createdAt: "2026-09-18T14:00:00Z" },
];

// ─── Unavailable Dates ──────────────────────────────────────────────────
export const unavailableDates: string[] = [
  "2026-10-05", "2026-10-06", "2026-10-14", "2026-10-15",
  "2026-10-25", "2026-10-26", "2026-11-01", "2026-11-02",
  "2026-11-14", "2026-11-15", "2026-11-22", "2026-11-23",
  "2026-12-25", "2026-12-31",
];

// ─── Time Slots ─────────────────────────────────────────────────────────
export const timeSlots: TimeSlot[] = [
  { id: "morning", label: "9:00 AM – 12:00 PM", available: true },
  { id: "afternoon", label: "12:00 PM – 3:00 PM", available: true },
  { id: "evening", label: "3:00 PM – 6:00 PM", available: true },
  { id: "golden", label: "4:00 PM – 7:00 PM", available: true },
  { id: "full", label: "Full day", available: true },
];

// ─── Admin Stats ────────────────────────────────────────────────────────
export const mockAdminStats = {
  totalRevenue: 482300,
  totalOrders: 128,
  totalBookings: 17,
  totalCustomers: 1904,
  pendingOrders: 8,
  upcomingShoots: 5,
  revenueByMonth: [
    { month: "Apr", amount: 38200 },
    { month: "May", amount: 42500 },
    { month: "Jun", amount: 51200 },
    { month: "Jul", amount: 39800 },
    { month: "Aug", amount: 62100 },
    { month: "Sep", amount: 48230 },
  ],
};

// ─── Admin Full Orders List ─────────────────────────────────────────────
export const mockAllOrders: Order[] = [
  ...mockUserOrders,
  {
    id: "AU-10481",
    userId: "u3",
    customerName: "Rahul Mehta",
    customerPhone: "9812345678",
    customerEmail: "rahul@email.com",
    items: [
      { id: "oi5", productId: "heirloom-album", name: "Heirloom Album", image: images.album, price: 8999, qty: 1, size: "12×12" },
    ],
    address: { id: "a3", userId: "u3", label: "Home", name: "Rahul Mehta", phone: "9812345678", line1: "56 Civil Lines", city: "Delhi", state: "Delhi", pincode: "110054", isDefault: true },
    subtotal: 8999,
    shipping: 0,
    total: 8999,
    status: "Processing",
    paymentMethod: "card",
    paymentStatus: "paid",
    createdAt: "2026-09-27T16:00:00Z",
    updatedAt: "2026-09-28T10:00:00Z",
  },
  {
    id: "AU-10475",
    userId: "u4",
    customerName: "Vikram Singh",
    customerPhone: "9898765432",
    customerEmail: "vikram@email.com",
    items: [
      { id: "oi6", productId: "classic-frame", name: "Classic Gallery Frame", image: images.frame, price: 999, qty: 2, size: "8×10" },
      { id: "oi7", productId: "couple-mug", name: "Couple Mug Set", image: images.mug, price: 1099, qty: 1 },
    ],
    address: { id: "a4", userId: "u4", label: "Home", name: "Vikram Singh", phone: "9898765432", line1: "12 Ashram Road", city: "Ahmedabad", state: "Gujarat", pincode: "380009", isDefault: true },
    subtotal: 3097,
    shipping: 0,
    total: 3097,
    status: "Pending",
    paymentMethod: "upi",
    paymentStatus: "paid",
    createdAt: "2026-09-24T09:00:00Z",
    updatedAt: "2026-09-24T09:00:00Z",
  },
  {
    id: "AU-10470",
    userId: "u5",
    customerName: "Kavya Reddy",
    customerPhone: "9123456789",
    customerEmail: "kavya@email.com",
    items: [
      { id: "oi8", productId: "memory-mug", name: "Memory Mug", image: images.mug, price: 599, qty: 4, size: "330 ml" },
    ],
    address: { id: "a5", userId: "u5", label: "Office", name: "Kavya Reddy", phone: "9123456789", line1: "Hitech City, Madhapur", city: "Hyderabad", state: "Telangana", pincode: "500081", isDefault: true },
    subtotal: 2396,
    shipping: 0,
    total: 2396,
    status: "Delivered",
    paymentMethod: "upi",
    paymentStatus: "paid",
    createdAt: "2026-09-20T11:00:00Z",
    updatedAt: "2026-09-25T15:00:00Z",
  },
];

// ─── Admin Full Bookings List ───────────────────────────────────────────
export const mockAllBookings: Booking[] = [
  ...mockUserBookings,
  {
    id: "BK-2206",
    customerName: "Rohit Jain",
    customerPhone: "9871234567",
    serviceId: "pre-wedding",
    serviceName: "Pre-Wedding",
    date: "2026-10-20",
    timeSlot: "4:00 PM – 7:00 PM",
    location: "Pushkar Lake",
    amount: 25000,
    status: "Pending",
    paymentStatus: "pending",
    createdAt: "2026-09-25T14:00:00Z",
  },
  {
    id: "BK-2203",
    customerName: "Meera Nair",
    customerPhone: "9856781234",
    serviceId: "family",
    serviceName: "Baby & Family",
    date: "2026-10-08",
    timeSlot: "10:00 AM – 12:00 PM",
    location: "Aurelia Studio",
    amount: 7999,
    status: "Confirmed",
    paymentStatus: "paid",
    createdAt: "2026-09-20T10:00:00Z",
  },
  {
    id: "BK-2200",
    customerName: "Aditya Verma",
    customerPhone: "9845671234",
    serviceId: "birthday",
    serviceName: "Birthday",
    date: "2026-09-18",
    timeSlot: "3:00 PM – 6:00 PM",
    location: "Radisson, Jaipur",
    amount: 9999,
    status: "Completed",
    paymentStatus: "paid",
    createdAt: "2026-09-10T09:00:00Z",
  },
];

// ─── Mock Customers ─────────────────────────────────────────────────────
export const mockCustomers = [
  { id: "u1", name: "Priya Sharma", email: "priya@email.com", phone: "9876543210", orders: 3, bookings: 3, totalSpent: 14895, joinedAt: "2026-06-15" },
  { id: "u2", name: "Meera Nair", email: "meera@email.com", phone: "9856781234", orders: 1, bookings: 1, totalSpent: 7999, joinedAt: "2026-07-20" },
  { id: "u3", name: "Rahul Mehta", email: "rahul@email.com", phone: "9812345678", orders: 2, bookings: 0, totalSpent: 17998, joinedAt: "2026-05-10" },
  { id: "u4", name: "Vikram Singh", email: "vikram@email.com", phone: "9898765432", orders: 1, bookings: 0, totalSpent: 3097, joinedAt: "2026-08-01" },
  { id: "u5", name: "Kavya Reddy", email: "kavya@email.com", phone: "9123456789", orders: 1, bookings: 0, totalSpent: 2396, joinedAt: "2026-09-05" },
  { id: "u6", name: "Ananya Kapoor", email: "ananya@email.com", phone: "9765432109", orders: 0, bookings: 1, totalSpent: 145000, joinedAt: "2026-08-20" },
  { id: "u7", name: "Rohit Jain", email: "rohit@email.com", phone: "9871234567", orders: 0, bookings: 1, totalSpent: 25000, joinedAt: "2026-09-25" },
  { id: "u8", name: "Aditya Verma", email: "aditya@email.com", phone: "9845671234", orders: 0, bookings: 1, totalSpent: 9999, joinedAt: "2026-09-10" },
];
