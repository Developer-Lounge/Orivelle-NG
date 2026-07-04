export interface DeliveryFeeResponse {
  state: string;
  lga?: string;
  flat_fee: number;
  per_km_fee: number;
  estimated_days: number;
  total_fee: number;
}

export interface DeliveryAddress {
  full_name: string;
  street_address: string;
  city: string;
  state: string;
  lga?: string;
  postal_code: string;
  phone: string;
}
