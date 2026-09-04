export type CategorySlug =
  | "hogar"
  | "herramientas"
  | "moda"
  | "decoracion"
  | "bienestar"
  | "tecnologia"
  | "hallazgos";

export interface Category {
  slug: CategorySlug;
  name: string;
  description: string;
  tagline?: string;
  image: string;
  subcategories: string[];
}

export type ProductTag = "nuevo" | "masVendido" | "oferta";

export interface ProductVariant {
  type: "color" | "talla";
  options: string[];
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  category: CategorySlug;
  subcategory: string;
  price: number;
  previousPrice?: number;
  sku: string;
  images: string[];
  tags: ProductTag[];
  variants?: ProductVariant[];
  rating?: number;
  reviewsCount?: number;
  stock: number;
  active: boolean;
  features?: string[];
}

export type OrderStatus =
  | "Nuevo"
  | "Confirmando"
  | "Confirmado"
  | "En preparación"
  | "Enviado"
  | "Entregado"
  | "Cancelado";

export interface OrderItem {
  productId: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  variant?: string;
}

export interface Order {
  number: string;
  createdAt: string;
  status: OrderStatus;
  customer: {
    fullName: string;
    phone: string;
    email: string;
    department: string;
    city: string;
    address: string;
    neighborhood: string;
    reference?: string;
    notes?: string;
  };
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  paymentMethod: "Pago contra entrega";
}

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  previousPrice?: number;
  quantity: number;
  variant?: string;
  stock: number;
}
