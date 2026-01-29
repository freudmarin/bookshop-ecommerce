// ============================================
// The Literary Haven - TypeScript Types
// Core type definitions for the application
// ============================================

/**
 * Product/Book type from the database
 */
export interface Product {
  id: string;
  title: string;
  author: string;
  isbn: string | null;
  description: string | null;
  price: number;
  cover_image_url: string | null;
  stock_quantity: number;
  category: string;
  publisher: string | null;
  publication_year: number | null;
  page_count: number | null;
  created_at: string;
  updated_at?: string;
}

/**
 * Order status enum matching database
 */
export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

/**
 * Order type from the database
 */
export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  city: string;
  postal_code: string;
  total_amount: number;
  status: OrderStatus;
  payment_method: string;
  notes?: string | null;
  created_at: string;
  updated_at?: string;
}

/**
 * Order item type from the database
 */
export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price_at_purchase: number;
  created_at: string;
  product?: Product; // Joined product data
}

/**
 * Order with items for display
 */
export interface OrderWithItems extends Order {
  order_items: OrderItem[];
}

/**
 * Cart item for local state management
 */
export interface CartItem {
  product: Product;
  quantity: number;
}

/**
 * Cart state
 */
export interface CartState {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  shipping: number;
  total: number;
}

/**
 * Customer checkout form data
 */
export interface CheckoutFormData {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  city: string;
  postal_code: string;
  notes?: string;
}

/**
 * Product filter options
 */
export interface ProductFilters {
  category?: string; // For backward compatibility with URL params
  categories?: string[]; // For multiple category selection
  author?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sortBy?: 'price_asc' | 'price_desc' | 'title' | 'newest';
}

/**
 * API response wrapper
 */
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

/**
 * Category with count
 */
export interface CategoryCount {
  category: string;
  count: number;
}

/**
 * Order creation payload
 */
export interface CreateOrderPayload {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  city: string;
  postal_code: string;
  total_amount: number;
  notes?: string;
  items: {
    product_id: string;
    quantity: number;
    price_at_purchase: number;
  }[];
}
