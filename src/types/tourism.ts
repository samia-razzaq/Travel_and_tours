export interface City {
  id: number;
  name: string;
  image: string;
  created_at: string;
  modified_at: string;
  country: number;
}

export interface Location {
  id: number;
  name: string;
  image: string;
  created_at: string;
  modified_at: string;
  city: number;
}

export interface Package {
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
}

export interface Currency {
  id: number;
  name: string;
  created_at: string;
  modified_at: string;
  country: number;
}

export interface Pricing {
  id: number;
  currency: Currency;
  private_base_price: number;
  private_child_price: number;
  private_adult_price: number;
  shared_adult_price: number;
  shared_child_price: number;
  without_transfer_adult_price: number;
  without_transfer_child_price: number;
  private_adult_discount: number | null;
  private_child_discount: number | null;
  shared_adult_discount: number | null;
  shared_child_discount: number | null;
  without_transfer_adult_discount: number | null;
  without_transfer_child_discount: number | null;
  discount: number | null;
  created_at: string;
  modified_at: string;
  package: number;
  country: number;
}

export interface PackageDetail {
  id: number;
  pricing: Pricing;
  package: Package;
  description: string;
  meta_title: string | null;
  meta_description: string;
  slug: string;
  Transfer_Type: string;
  Pickup_Timings: string;
  Private_Pickup_Timings: string | null;
  Without_Transfer_Pickup_Timings: string | null;
  Duration_Approx: string;
  Private_Duration_Approx: string | null;
  Without_Transfer_Duration_Approx: string | null;
  Cancellation_Policy: string;
  child_policy: string;
  highlights: string;
  Inclusions: string;
  important_info: string;
  exclusions: string;
  today: string;
  is_child: boolean;
  is_infant: boolean;
  tags: string | null;
  base_price_threshold: number;
  created_at: string;
  modified_at: string;
}
export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactResponse {
  success: string;
}
