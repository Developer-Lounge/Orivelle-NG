export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  title: string;
  text: string;
  images: string[]; // Cloudinary URLs
  verified_purchase: boolean;
  helpful_count: number;
  created_at: string;
  updated_at: string;
}

export interface ReviewFormData {
  rating: number;
  title: string;
  text: string;
  images: File[];
}

export interface CreateReviewRequest {
  product_id: string;
  rating: number;
  title: string;
  text: string;
  images?: File[];
}
