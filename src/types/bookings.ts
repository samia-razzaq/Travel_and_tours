export interface Booking {
  id: number;
  booking_reference: string;
  package_title: string;
  package_image: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  tour_option: string; // "P" | "S" | "W"
  adult_pax: number;
  child_pax: number;
  infant_pax: number;
  booking_date: string;
  created_at: string;
  pickup_place: string;
  dropOff_place: string;
  current_country: string;
  total_amount: number;
  discounted_amount: number;
  payment_status: string | null;
  detail: string;
}

// API Response types
export interface BookingsApiResponse {
  "Booking List": Booking[];
}

export interface PaginatedBookingsResponse {
  results: Booking[];
  count?: number;
  next?: string | null;
  previous?: string | null;
}