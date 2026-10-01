// ─── Core ───────────────────────────────────────────────────────────────
export type ID = string;
export type ISO = string; // ISO 8601 date string
export type Url = string;
export type INR = number; // paise or whole rupees depending on backend

// ─── User / Auth ────────────────────────────────────────────────────────
export interface User {
  id: ID;
  name: string;
  email: string;
  phone: string;
  avatar?: Url;
  role: "customer" | "admin";
  createdAt: ISO;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

// ─── Address ────────────────────────────────────────────────────────────
export interface Address {
  id: ID;
  userId: ID;
  label: string; // "Home", "Office", etc.
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

// ─── Product ────────────────────────────────────────────────────────────
export type ProductCategory =
  | "Photo Frames"
  | "Photo Mugs"
  | "Photo Albums"
  | "Personalized Gifts"
  | "Templates";

export interface ProductVariant {
  id: ID;
  label: string; // "5×7", "330 ml"
  priceAdjustment: number; // +/- from base price
  stock: number;
}

export interface ProductCustomization {
  allowPhoto: boolean;
  allowText: boolean;
  textMaxLength: number;
  templateIds?: ID[];
}

export interface Product {
  id: ID;
  name: string;
  slug: string;
  category: ProductCategory;
  price: number;
  mrp?: number;
  images: Url[];
  thumbnail: Url;
  description: string;
  shortNote: string;
  material?: string;
  rating: number;
  reviewCount: number;
  variants?: ProductVariant[];
  sizes?: string[];
  customization?: ProductCustomization;
  isNew?: boolean;
  isBestSeller?: boolean;
  stock: number;
  deliveryDays: string;
  createdAt: ISO;
}

export interface ProductTemplate {
  id: ID;
  name: string;
  thumbnail: Url;
  category: ProductCategory;
}

// ─── Cart ───────────────────────────────────────────────────────────────
export interface CartItem {
  key: string;
  productId: ID;
  name: string;
  image: Url;
  price: number;
  qty: number;
  size?: string;
  customText?: string;
  customPhoto?: Url;
  templateId?: ID;
}

// ─── Wishlist ───────────────────────────────────────────────────────────
export interface WishlistItem {
  productId: ID;
  addedAt: ISO;
}

// ─── Order ──────────────────────────────────────────────────────────────
export type OrderStatus =
  | "Pending"
  | "Confirmed"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

export interface OrderItem {
  id: ID;
  productId: ID;
  name: string;
  image: Url;
  price: number;
  qty: number;
  size?: string;
  customText?: string;
  customPhoto?: Url;
}

export interface Order {
  id: ID;
  userId: ID;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  items: OrderItem[];
  address: Address;
  subtotal: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  paymentMethod: "upi" | "card" | "cod";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  trackingId?: string;
  createdAt: ISO;
  updatedAt: ISO;
}

// ─── Booking ────────────────────────────────────────────────────────────
export type BookingStatus =
  | "Pending"
  | "Confirmed"
  | "Completed"
  | "Cancelled";

export interface Booking {
  id: ID;
  userId?: ID;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  serviceId: ID;
  serviceName: string;
  packageName?: string;
  date: ISO;
  timeSlot?: string;
  location: string;
  notes?: string;
  amount: number;
  status: BookingStatus;
  paymentStatus: "pending" | "paid" | "partial";
  createdAt: ISO;
}

// ─── Photography ────────────────────────────────────────────────────────
export interface PhotographyPackage {
  id: ID;
  serviceId: ID;
  name: string;
  price: number;
  duration: string;
  features: string[];
  isFeatured?: boolean;
}

export interface PhotographyService {
  id: ID;
  name: string;
  slug: string;
  image: Url;
  description: string;
  startingPrice: number;
  duration: string;
  includes: string[];
  packages: PhotographyPackage[];
}

// ─── Portfolio ──────────────────────────────────────────────────────────
export interface PortfolioItem {
  id: ID;
  title: string;
  category: string;
  imageUrl: Url;
  thumbnailUrl: Url;
  isTall?: boolean;
  createdAt: ISO;
}

// ─── Payment ────────────────────────────────────────────────────────────
export interface Payment {
  id: ID;
  orderId?: ID;
  bookingId?: ID;
  amount: number;
  method: "upi" | "card" | "cod" | "razorpay";
  status: "pending" | "success" | "failed" | "refunded";
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  createdAt: ISO;
}

// ─── Review ─────────────────────────────────────────────────────────────
export interface Review {
  id: ID;
  productId: ID;
  userId: ID;
  userName: string;
  rating: number;
  comment: string;
  images?: Url[];
  createdAt: ISO;
}

// ─── Time Slots ─────────────────────────────────────────────────────────
export interface TimeSlot {
  id: string;
  label: string; // "9:00 AM – 12:00 PM"
  available: boolean;
}

// ─── Admin Stats ────────────────────────────────────────────────────────
export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalBookings: number;
  totalCustomers: number;
  pendingOrders: number;
  upcomingShoots: number;
  revenueByMonth: { month: string; amount: number }[];
}
