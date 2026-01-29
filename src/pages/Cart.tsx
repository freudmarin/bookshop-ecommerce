// ============================================
// Cart Page
// Shopping cart with items and summary
// ============================================

import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, Trash2 } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { CartItem, CartSummary } from '../components/cart';
import { Button, EmptyState } from '../components/common';

const Cart = () => {
  const { items, clearCart, totalItems } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-literary-cream py-12">
        <div className="container mx-auto px-4">
          <EmptyState
            icon={<ShoppingBag className="w-12 h-12 text-literary-leather" />}
            title="Your cart is empty"
            description="Looks like you haven't added any books yet. Start exploring our collection!"
            actionLabel="Browse Books"
            onAction={() => window.location.href = '/products'}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-literary-cream">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-8">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Shopping Cart
          </h1>
          <p className="text-gray-600">{totalItems} items in your cart</p>
        </div>
      </div>

      {/* Cart Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                <h2 className="font-semibold text-gray-900">
                  Cart Items ({totalItems})
                </h2>
                <button
                  onClick={clearCart}
                  className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear Cart
                </button>
              </div>

              {/* Items List */}
              <div>
                {items.map((item) => (
                  <CartItem key={item.product.id} item={item} />
                ))}
              </div>
            </div>

            {/* Continue Shopping */}
            <div className="mt-6">
              <Link to="/products">
                <Button variant="ghost" leftIcon={<ArrowLeft className="w-4 h-4" />}>
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-96">
            <div className="sticky top-24">
              <CartSummary />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
