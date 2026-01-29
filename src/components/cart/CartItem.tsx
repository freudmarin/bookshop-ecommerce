// ============================================
// CartItem Component
// Individual item in the shopping cart
// ============================================

import { Link } from 'react-router-dom';
import { Trash2, Minus, Plus, BookOpen } from 'lucide-react';
import { CartItem as CartItemType } from '../../types';
import { formatPrice } from '../../utils/formatters';
import { useCart } from '../../hooks/useCart';

interface CartItemProps {
  item: CartItemType;
}

const CartItem = ({ item }: CartItemProps) => {
  const { updateQuantity, removeItem } = useCart();
  const { product, quantity } = item;

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity <= 0) {
      removeItem(product.id);
    } else {
      updateQuantity(product.id, Math.min(newQuantity, product.stock_quantity));
    }
  };

  const handleRemove = () => {
    removeItem(product.id);
  };

  // Fallback image
  const ImagePlaceholder = () => (
    <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-200 
                    flex items-center justify-center">
      <BookOpen className="w-8 h-8 text-primary-400" />
    </div>
  );

  return (
    <div className="flex gap-4 py-4 border-b border-gray-200 last:border-0">
      {/* Product Image */}
      <Link 
        to={`/products/${product.id}`}
        className="w-20 h-28 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100"
      >
        {product.cover_image_url ? (
          <img
            src={product.cover_image_url}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <ImagePlaceholder />
        )}
      </Link>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <Link 
          to={`/products/${product.id}`}
          className="hover:text-literary-leather transition-colors"
        >
          <h3 className="font-semibold text-gray-900 line-clamp-1">
            {product.title}
          </h3>
        </Link>
        <p className="text-sm text-gray-600 mb-2">{product.author}</p>
        <p className="text-literary-leather font-semibold">
          {formatPrice(product.price)}
        </p>

        {/* Mobile: Price and Remove */}
        <div className="flex items-center justify-between mt-3 sm:hidden">
          {/* Quantity Controls */}
          <div className="flex items-center border border-gray-300 rounded-lg">
            <button
              onClick={() => handleQuantityChange(-1)}
              className="p-1.5 hover:bg-gray-100"
              aria-label="Decrease quantity"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 text-sm font-medium">{quantity}</span>
            <button
              onClick={() => handleQuantityChange(1)}
              disabled={quantity >= product.stock_quantity}
              className="p-1.5 hover:bg-gray-100 disabled:opacity-50"
              aria-label="Increase quantity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleRemove}
            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
            aria-label="Remove item"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Desktop: Quantity and Subtotal */}
      <div className="hidden sm:flex items-center gap-6">
        {/* Quantity Controls */}
        <div className="flex items-center border border-gray-300 rounded-lg">
          <button
            onClick={() => handleQuantityChange(-1)}
            className="p-2 hover:bg-gray-100"
            aria-label="Decrease quantity"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="px-4 py-2 font-medium min-w-[3rem] text-center">
            {quantity}
          </span>
          <button
            onClick={() => handleQuantityChange(1)}
            disabled={quantity >= product.stock_quantity}
            className="p-2 hover:bg-gray-100 disabled:opacity-50"
            aria-label="Increase quantity"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Subtotal */}
        <div className="w-24 text-right">
          <span className="font-semibold text-gray-900">
            {formatPrice(product.price * quantity)}
          </span>
        </div>

        {/* Remove Button */}
        <button
          onClick={handleRemove}
          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
          aria-label="Remove item"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
