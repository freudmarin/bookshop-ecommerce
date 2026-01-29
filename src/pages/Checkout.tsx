// ============================================
// Checkout Page
// Order form and summary
// ============================================

import { Link, Navigate } from 'react-router-dom';
import { ChevronRight, Home, ShoppingCart, BookOpen } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { CheckoutForm } from '../components/checkout';
import { formatPrice } from '../utils/formatters';

const Checkout = () => {
  const { items, subtotal, shipping, total } = useCart();

  // Redirect to cart if empty
  if (items.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  // Fallback image
  const ImagePlaceholder = () => (
    <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-200 
                    flex items-center justify-center">
      <BookOpen className="w-4 h-4 text-primary-400" />
    </div>
  );

  return (
    <div className="min-h-screen bg-literary-cream">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-literary-leather flex items-center gap-1">
              <Home className="w-4 h-4" />
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/cart" className="hover:text-literary-leather flex items-center gap-1">
              <ShoppingCart className="w-4 h-4" />
              Cart
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">Checkout</span>
          </nav>
        </div>
      </div>

      {/* Page Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-8">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-gray-900">
            Checkout
          </h1>
        </div>
      </div>

      {/* Checkout Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Checkout Form */}
          <div className="flex-1">
            <CheckoutForm />
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:w-96">
            <div className="sticky top-24">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="font-semibold text-gray-900 mb-4">
                  Order Summary ({items.length} items)
                </h2>

                {/* Items Preview */}
                <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex gap-3">
                      <div className="w-12 h-16 flex-shrink-0 rounded overflow-hidden bg-gray-100">
                        {item.product.cover_image_url ? (
                          <img
                            src={item.product.cover_image_url}
                            alt={item.product.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ImagePlaceholder />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {item.product.title}
                        </p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                        <p className="text-sm text-literary-leather">
                          {formatPrice(item.product.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="border-t border-gray-200 pt-4 space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>
                      {shipping === 0 ? (
                        <span className="text-green-600">FREE</span>
                      ) : (
                        formatPrice(shipping)
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold pt-2 border-t border-gray-200">
                    <span>Total</span>
                    <span className="text-literary-leather">{formatPrice(total)}</span>
                  </div>
                </div>

                {/* Edit Cart Link */}
                <Link 
                  to="/cart"
                  className="block text-center text-sm text-literary-leather hover:underline mt-4"
                >
                  Edit Cart
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
