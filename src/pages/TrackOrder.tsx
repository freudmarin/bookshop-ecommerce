// ============================================
// Track Order Page
// Look up order status by order number
// ============================================

import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Package, BookOpen } from 'lucide-react';
import { useOrders } from '../hooks/useSupabase';
import { OrderWithItems } from '../types';
import { Input, Button, Loading, ErrorMessage } from '../components/common';
import { formatPrice, formatDateTime, getEstimatedDelivery, getStatusColor } from '../utils/formatters';

const TrackOrder = () => {
  const [searchParams] = useSearchParams();
  const { getOrderByNumber, loading, error } = useOrders();
  
  const [orderNumber, setOrderNumber] = useState(searchParams.get('order') || '');
  const [order, setOrder] = useState<OrderWithItems | null>(null);
  const [searched, setSearched] = useState(false);

  // Auto-search if order number in URL
  useEffect(() => {
    const urlOrderNumber = searchParams.get('order');
    if (urlOrderNumber) {
      handleSearch(urlOrderNumber);
    }
  }, []);

  const handleSearch = async (searchOrderNumber?: string) => {
    const numberToSearch = searchOrderNumber || orderNumber;
    if (!numberToSearch.trim()) return;

    setSearched(true);
    const data = await getOrderByNumber(numberToSearch.trim());
    setOrder(data);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  // Order status steps
  const statusSteps = ['pending', 'confirmed', 'shipped', 'delivered'];
  const currentStepIndex = order ? statusSteps.indexOf(order.status) : -1;

  // Fallback image
  const ImagePlaceholder = () => (
    <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-200 
                    flex items-center justify-center">
      <BookOpen className="w-4 h-4 text-primary-400" />
    </div>
  );

  return (
    <div className="min-h-screen bg-literary-cream">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-8">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Track Your Order
          </h1>
          <p className="text-gray-600">
            Enter your order number to see the current status
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search Form */}
        <div className="max-w-xl mx-auto mb-8">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <div className="flex-1">
              <Input
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="Enter order number (e.g., LH-20240115-1234)"
                leftIcon={<Package className="w-4 h-4" />}
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              leftIcon={<Search className="w-4 h-4" />}
              isLoading={loading}
            >
              Track
            </Button>
          </form>
        </div>

        {/* Loading */}
        {loading && <Loading text="Looking up your order..." />}

        {/* Error */}
        {error && !loading && searched && (
          <ErrorMessage
            title="Order Not Found"
            message="We couldn't find an order with that number. Please check and try again."
            onRetry={() => handleSearch()}
          />
        )}

        {/* Order Details */}
        {order && !loading && (
          <div className="max-w-3xl mx-auto">
            {/* Order Status Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm text-gray-500">Order Number</p>
                  <p className="text-xl font-bold text-literary-leather">{order.order_number}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>

              {/* Status Progress */}
              {order.status !== 'cancelled' && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    {statusSteps.map((step, index) => (
                      <div key={step} className="flex flex-col items-center flex-1">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          index <= currentStepIndex
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 text-gray-500'
                        }`}>
                          {index + 1}
                        </div>
                        <span className="text-xs text-gray-500 mt-1 capitalize">{step}</span>
                      </div>
                    ))}
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500 transition-all duration-500"
                      style={{ width: `${Math.max(0, (currentStepIndex + 1) / statusSteps.length * 100)}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Order Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Order Date</p>
                  <p className="font-medium">{formatDateTime(order.created_at)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Estimated Delivery</p>
                  <p className="font-medium">{getEstimatedDelivery(order.created_at)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Total Amount</p>
                  <p className="font-medium text-literary-leather">{formatPrice(order.total_amount)}</p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
              <h2 className="font-semibold text-gray-900 mb-4">Order Items</h2>
              <div className="divide-y divide-gray-200">
                {order.order_items.map((item) => (
                  <div key={item.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                    <div className="w-12 h-16 flex-shrink-0 rounded overflow-hidden bg-gray-100">
                      {item.product?.cover_image_url ? (
                        <img
                          src={item.product.cover_image_url}
                          alt={item.product?.title || 'Book'}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ImagePlaceholder />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.product?.title}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium">{formatPrice(item.price_at_purchase * item.quantity)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Shipping Address</h2>
              <p className="font-medium">{order.customer_name}</p>
              <p className="text-gray-600">{order.shipping_address}</p>
              <p className="text-gray-600">{order.city}, {order.postal_code}</p>
              <p className="text-gray-600 mt-2">{order.customer_phone}</p>
              <p className="text-gray-600">{order.customer_email}</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!order && !loading && !searched && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">
              Enter your order number above to track your order status
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackOrder;
