// ============================================
// useSupabase Hook
// Custom hook for Supabase database operations
// ============================================

import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { 
  Product, 
  Order, 
  OrderWithItems, 
  CreateOrderPayload,
  ProductFilters,
  CategoryCount,
  OrderStatus
} from '../types';

/**
 * Custom hook for product-related Supabase operations
 */
export const useProducts = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch all products with optional filters
   */
  const getProducts = useCallback(async (filters?: ProductFilters): Promise<Product[]> => {
    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('products')
        .select('*');

      // Apply filters
      if (filters?.categories && filters.categories.length > 0) {
        // If we have broad categories (without ' - '), use partial matching
        const hasBroadCategories = filters.categories.some(cat => !cat.includes(' - '));
        
        if (hasBroadCategories) {
          // Use OR conditions for partial matching
          const orConditions = filters.categories.map(cat => {
            if (cat.includes(' - ')) {
              // Specific category - exact match
              return `category.eq.${cat}`;
            } else {
              // Broad category - partial match (e.g., "Fiction" matches "Fiction - Classics")
              return `category.ilike.${cat}%`;
            }
          }).join(',');
          query = query.or(orConditions);
        } else {
          // All specific categories - use exact match
          query = query.in('category', filters.categories);
        }
      } else if (filters?.category) {
        // Backward compatibility for single category
        if (filters.category.includes(' - ')) {
          query = query.eq('category', filters.category);
        } else {
          // Broad category - partial match
          query = query.ilike('category', `${filters.category}%`);
        }
      }

      if (filters?.author) {
        query = query.ilike('author', `%${filters.author}%`);
      }

      if (filters?.minPrice !== undefined) {
        query = query.gte('price', filters.minPrice);
      }

      if (filters?.maxPrice !== undefined) {
        query = query.lte('price', filters.maxPrice);
      }

      if (filters?.search) {
        query = query.or(
          `title.ilike.%${filters.search}%,author.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
        );
      }

      // Apply sorting
      switch (filters?.sortBy) {
        case 'price_asc':
          query = query.order('price', { ascending: true });
          break;
        case 'price_desc':
          query = query.order('price', { ascending: false });
          break;
        case 'title':
          query = query.order('title', { ascending: true });
          break;
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;
      return data || [];
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch products';
      setError(message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch a single product by ID
   */
  const getProductById = useCallback(async (id: string): Promise<Product | null> => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch product';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get all unique categories with counts
   */
  const getCategories = useCallback(async (): Promise<CategoryCount[]> => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('products')
        .select('category');

      if (fetchError) throw fetchError;

      // Count products per category
      const categoryMap = new Map<string, number>();
      data?.forEach((item) => {
        const count = categoryMap.get(item.category) || 0;
        categoryMap.set(item.category, count + 1);
      });

      return Array.from(categoryMap, ([category, count]) => ({ category, count }))
        .sort((a, b) => a.category.localeCompare(b.category));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch categories';
      setError(message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get featured products (random selection or newest)
   */
  const getFeaturedProducts = useCallback(async (limit = 4): Promise<Product[]> => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('products')
        .select('*')
        .gt('stock_quantity', 0)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (fetchError) throw fetchError;
      return data || [];
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch featured products';
      setError(message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Check stock availability for multiple products
   */
  const checkStockAvailability = useCallback(async (
    items: { productId: string; quantity: number }[]
  ): Promise<{ available: boolean; unavailableItems: string[] }> => {
    try {
      const productIds = items.map(item => item.productId);
      
      const { data, error: fetchError } = await supabase
        .from('products')
        .select('id, title, stock_quantity')
        .in('id', productIds);

      if (fetchError) throw fetchError;

      const unavailableItems: string[] = [];
      
      items.forEach(item => {
        const product = data?.find(p => p.id === item.productId);
        if (!product || product.stock_quantity < item.quantity) {
          unavailableItems.push(product?.title || item.productId);
        }
      });

      return {
        available: unavailableItems.length === 0,
        unavailableItems,
      };
    } catch (err) {
      console.error('Stock check failed:', err);
      return { available: false, unavailableItems: ['Unable to verify stock'] };
    }
  }, []);

  return {
    loading,
    error,
    getProducts,
    getProductById,
    getCategories,
    getFeaturedProducts,
    checkStockAvailability,
  };
};

/**
 * Custom hook for order-related Supabase operations
 */
export const useOrders = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Create a new order with items
   */
  const createOrder = useCallback(async (
    orderData: CreateOrderPayload
  ): Promise<Order | null> => {
    setLoading(true);
    setError(null);

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();

      // First, create the order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user?.id || null,
          customer_name: orderData.customer_name,
          customer_email: orderData.customer_email,
          customer_phone: orderData.customer_phone,
          shipping_address: orderData.shipping_address,
          city: orderData.city,
          postal_code: orderData.postal_code,
          total_amount: orderData.total_amount,
          notes: orderData.notes,
          payment_method: 'cash_on_delivery',
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Then, create order items
      const orderItems = orderData.items.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price_at_purchase: item.price_at_purchase,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        // If items fail, we should ideally rollback the order
        // For simplicity, we'll just log the error
        console.error('Failed to create order items:', itemsError);
        throw itemsError;
      }

      return order;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create order';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch an order by order number
   */
  const getOrderByNumber = useCallback(async (
    orderNumber: string
  ): Promise<OrderWithItems | null> => {
    setLoading(true);
    setError(null);

    try {
      // Fetch order with items and product details
      const { data: order, error: fetchError } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            product:products (*)
          )
        `)
        .eq('order_number', orderNumber)
        .single();

      if (fetchError) throw fetchError;
      return order as OrderWithItems;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch order';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch orders by customer email
   */
  const getOrdersByEmail = useCallback(async (
    email: string
  ): Promise<Order[]> => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('orders')
        .select('*')
        .eq('customer_email', email)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      return data || [];
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch orders';
      setError(message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch all orders (admin function)
   */
  const getAllOrders = useCallback(async (): Promise<Order[]> => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      return data || [];
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch orders';
      setError(message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update order status (admin function)
   */
  const updateOrderStatus = useCallback(async (
    orderId: string,
    status: OrderStatus
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const { error: updateError } = await supabase
        .from('orders')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', orderId);

      if (updateError) throw updateError;
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update order status';
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Cancel order (customer function - only for pending orders)
   */
  const cancelOrder = useCallback(async (orderId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      // First check if order is still pending
      const { data: order, error: fetchError } = await supabase
        .from('orders')
        .select('status')
        .eq('id', orderId)
        .single();

      if (fetchError) throw fetchError;

      if (order.status !== 'pending') {
        throw new Error('Only pending orders can be cancelled');
      }

      const { error: updateError } = await supabase
        .from('orders')
        .update({ status: 'cancelled', updated_at: new Date().toISOString() })
        .eq('id', orderId);

      if (updateError) throw updateError;
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to cancel order';
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    createOrder,
    getOrderByNumber,
    getOrdersByEmail,
    getAllOrders,
    updateOrderStatus,
    cancelOrder,
  };
};

export default { useProducts, useOrders };
