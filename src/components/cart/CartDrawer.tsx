// ============================================
// CartDrawer Component
// Slide-out cart preview (optional feature)
// ============================================

import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, ShoppingCart, ArrowRight, BookOpen } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { formatPrice } from '../../utils/formatters';
import { Button } from '../common';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer = ({ isOpen, onClose }: CartDrawerProps) => {
  const navigate = useNavigate();
  const { items, subtotal, totalItems } = useCart();

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  const handleViewCart = () => {
    onClose();
    navigate('/cart');
  };

  // Fallback image
  const ImagePlaceholder = () => (
    <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-200 
                    flex items-center justify-center">
      <BookOpen className="w-6 h-6 text-primary-400" />
    </div>
  );

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-xl 
                      flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Cart ({totalItems})
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingCart className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-gray-600 mb-4">Your cart is empty</p>
              <Button variant="primary" onClick={onClose}>
                Continue Shopping
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-3">
                  <Link 
                    to={`/products/${item.product.id}`}
                    onClick={onClose}
                    className="w-16 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100"
                  >
                    {item.product.cover_image_url ? (
                      <img
                        src={item.product.cover_image_url}
                        alt={item.product.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImagePlaceholder />
                    )}
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link 
                      to={`/products/${item.product.id}`}
                      onClick={onClose}
                      className="font-medium text-gray-900 line-clamp-1 hover:text-literary-leather"
                    >
                      {item.product.title}
                    </Link>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    <p className="text-literary-leather font-semibold">
                      {formatPrice(item.product.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-4 border-t border-gray-200 space-y-4">
            <div className="flex justify-between text-lg font-semibold">
              <span>Subtotal</span>
              <span className="text-literary-leather">{formatPrice(subtotal)}</span>
            </div>
            <p className="text-sm text-gray-500">
              Shipping calculated at checkout
            </p>
            <div className="space-y-2">
              <Button
                variant="primary"
                fullWidth
                onClick={handleCheckout}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Checkout
              </Button>
              <Button
                variant="outline"
                fullWidth
                onClick={handleViewCart}
              >
                View Cart
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
