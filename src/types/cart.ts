export interface AddToCartPayload {
  package: number; // package ID
  tour_option: string; // e.g. "P" for Private, "S" for Shared, etc.
  adult_pax: number;
  child_pax: number;
  infant_pax: number;
  booking_date: string; // YYYY-MM-DD
  city: number;
  country: number;
  currency: number;
  location: number;
  pickup_place: string;
  dropOff_place: string;
  current_country: string;
}

export interface AddToCartResponse {
  // Adjust based on your actual API response
  success: boolean;
  message?: string;
  detail?: string;
  cart_item_id?: number;
  // ... other fields
}

export interface CartItem {
  id: number;
  Package_details: {
    id: number;
    name: string;
    image: string;
    is_active: boolean;
    created_at: string;
    modified_at: string;
    city: number;
    country: number;
    currency: number;
    location: number;
  };
  available_tour_options?: string; // e.g. "P,S,W"
  tour_option: string;
  adult_pax: number;
  child_pax: number;
  infant_pax: number;
  booking_date: string;
  current_country: string;
  pickup_place: string;
  dropOff_place: string;
  detail: string | null;
  total_price: number;
  created_at: string;
  modified_at: string;
  cart: number;
  package: number;
  city: number;
  country: number;
  currency: number;
  location: number;
}

export interface Cart {
  id: number;
  items: CartItem[];
  total_price: number;
  session_key: string;
  created_at: string;
  modified_at: string;
  user: number | null;
}

export interface RemoveFromCartResponse {
  id: number;
  message?: string;
  cart_total?: number;
  error?: string;
}

export interface UpdateCartItemPayload {
  tour_option?: string;
  adult_pax?: number;
  child_pax?: number;
  infant_pax?: number;
  booking_date?: string;
  pickup_place?: string;
  dropOff_place?: string;
  current_country?: string;
}

export interface UpdateCartItemResponse {
  item: CartItem;
  cart_total: number;
  message: string;
}

export interface CheckoutResponse {
  detail?: string;
  code?: string;
  checkout_url?: string;
  message?: string;
  bookings?: number[];
  error?: string;
}
