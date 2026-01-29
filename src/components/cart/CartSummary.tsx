// ============================================
// CartSummary Component
// Order summary with totals and checkout button
// ============================================

import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Truck, Tag } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { formatPrice } from '../../utils/formatters';
import { Button } from '../common';

interface CartSummaryProps {
  showCheckoutButton?: boolean;
}

const CartSummary = ({ showCheckoutButton = true }: CartSummaryProps) => {
  const navigate = useNavigate();
  const { items, subtotal, shipping, total, totalItems } = useCart();

  const freeShippingThreshold = 35;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <ShoppingBag className="w-5 h-5" />
        Order Summary
      </h2>

      {/* Free Shipping Progress */}
      {remainingForFreeShipping > 0 && items.length > 0 && (
        <div className="mb-4 p-3 bg-accent-50 rounded-lg">
          <p className="text-sm text-accent-700">
            Add <span className="font-semibold">{formatPrice(remainingForFreeShipping)}</span> more for free shipping!
          </p>
          <div className="mt-2 h-2 bg-accent-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-accent-500 rounded-full transition-all"
              style={{ width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Summary Details */}
      <div className="space-y-3 mb-4">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal ({totalItems} items)</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        
        <div className="flex justify-between text-gray-600">
          <span className="flex items-center gap-1">
            <Truck className="w-4 h-4" />
            Shipping
          </span>
          <span>
            {shipping === 0 ? (
              <span className="text-green-600 font-medium">FREE</span>
            ) : (
              formatPrice(shipping)
            )}
          </span>
        </div>

        {/* Promo Code Placeholder */}
        <div className="pt-2">
          <button className="text-sm text-literary-leather hover:underline flex items-center gap-1">
            <Tag className="w-4 h-4" />
            Have a promo code?
          </button>
        </div>
      </div>

      {/* Total */}
      <div className="border-t border-gray-200 pt-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-gray-900">Total</span>
          <span className="text-2xl font-bold text-literary-leather">
            {formatPrice(total)}
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Including VAT where applicable
        </p>
      </div>

      {/* Checkout Button */}
      {showCheckoutButton && (
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={() => navigate('/checkout')}
          disabled={items.length === 0}
        >
          Proceed to Checkout
        </Button>
      )}

      {/* Payment Info */}
      <div className="mt-4 p-3 bg-literary-parchment rounded-lg">
        <p className="text-xs text-center text-gray-600">
          💵 Pay on Delivery - No payment required now!
        </p>
      </div>
    </div>
  );
};

export default CartSummary;
