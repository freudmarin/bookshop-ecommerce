// ============================================
// Cart Context
// Global state management for shopping cart
// with localStorage persistence
// ============================================

import { createContext, useReducer, useEffect, useCallback, ReactNode } from 'react';
import type { CartItem, CartState, Product } from '../types';

// ============================================
// Constants
// ============================================
const CART_STORAGE_KEY = 'literary_haven_cart';
const SHIPPING_COST = 4.99;
const FREE_SHIPPING_THRESHOLD = 35;

// ============================================
// Cart Action Types
// ============================================
type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: Product; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: { productId: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] };

// ============================================
// Cart Context Type
// ============================================
interface CartContextType extends CartState {
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (productId: string) => boolean;
  getItemQuantity: (productId: string) => number;
}

// ============================================
// Initial State
// ============================================
const initialState: CartState = {
  items: [],
  totalItems: 0,
  subtotal: 0,
  shipping: 0,
  total: 0,
};

// ============================================
// Helper Functions
// ============================================

/**
 * Calculate cart totals from items
 */
const calculateTotals = (items: CartItem[]): Omit<CartState, 'items'> => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + shipping;

  return { totalItems, subtotal, shipping, total };
};

/**
 * Load cart from localStorage
 */
const loadCartFromStorage = (): CartItem[] => {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load cart from storage:', error);
  }
  return [];
};

/**
 * Save cart to localStorage
 */
const saveCartToStorage = (items: CartItem[]): void => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Failed to save cart to storage:', error);
  }
};

// ============================================
// Cart Reducer
// ============================================
const cartReducer = (state: CartState, action: CartAction): CartState => {
  let newItems: CartItem[];

  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, quantity } = action.payload;
      const existingIndex = state.items.findIndex(
        item => item.product.id === product.id
      );

      if (existingIndex >= 0) {
        // Update existing item quantity
        newItems = state.items.map((item, index) =>
          index === existingIndex
            ? { ...item, quantity: Math.min(item.quantity + quantity, item.product.stock_quantity) }
            : item
        );
      } else {
        // Add new item
        newItems = [...state.items, { product, quantity }];
      }

      saveCartToStorage(newItems);
      return { items: newItems, ...calculateTotals(newItems) };
    }

    case 'REMOVE_ITEM': {
      newItems = state.items.filter(
        item => item.product.id !== action.payload.productId
      );
      saveCartToStorage(newItems);
      return { items: newItems, ...calculateTotals(newItems) };
    }

    case 'UPDATE_QUANTITY': {
      const { productId, quantity } = action.payload;
      
      if (quantity <= 0) {
        // Remove item if quantity is 0 or less
        newItems = state.items.filter(item => item.product.id !== productId);
      } else {
        newItems = state.items.map(item =>
          item.product.id === productId
            ? { ...item, quantity: Math.min(quantity, item.product.stock_quantity) }
            : item
        );
      }

      saveCartToStorage(newItems);
      return { items: newItems, ...calculateTotals(newItems) };
    }

    case 'CLEAR_CART': {
      saveCartToStorage([]);
      return initialState;
    }

    case 'LOAD_CART': {
      const items = action.payload;
      return { items, ...calculateTotals(items) };
    }

    default:
      return state;
  }
};

// ============================================
// Create Context
// ============================================
export const CartContext = createContext<CartContextType | null>(null);

// ============================================
// Cart Provider Component
// ============================================
interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = loadCartFromStorage();
    if (savedCart.length > 0) {
      dispatch({ type: 'LOAD_CART', payload: savedCart });
    }
  }, []);

  /**
   * Add an item to the cart
   */
  const addItem = useCallback((product: Product, quantity = 1) => {
    dispatch({ type: 'ADD_ITEM', payload: { product, quantity } });
  }, []);

  /**
   * Remove an item from the cart
   */
  const removeItem = useCallback((productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { productId } });
  }, []);

  /**
   * Update the quantity of an item
   */
  const updateQuantity = useCallback((productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
  }, []);

  /**
   * Clear all items from the cart
   */
  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
  }, []);

  /**
   * Check if a product is in the cart
   */
  const isInCart = useCallback((productId: string): boolean => {
    return state.items.some(item => item.product.id === productId);
  }, [state.items]);

  /**
   * Get the quantity of a specific item in the cart
   */
  const getItemQuantity = useCallback((productId: string): number => {
    const item = state.items.find(item => item.product.id === productId);
    return item?.quantity || 0;
  }, [state.items]);

  const value: CartContextType = {
    ...state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    isInCart,
    getItemQuantity,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
