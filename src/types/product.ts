export interface Variant {
  id: string;
  color: string;
  colorHex: string;
  size: string;
  price: number;
  stock: number;
  images: string[];
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  description: string;
  category: string;
  variants: Variant[];
  features: string[];
  isNew?: boolean;
  isFlashSale?: boolean;
  originalPrice?: number;
}

export interface CartItem {
  variantId: string;
  productName: string;
  brand: string;
  color: string;
  size: string;
  price: number;
  quantity: number;
  image: string;
}
