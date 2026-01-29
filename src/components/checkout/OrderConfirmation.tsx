// ============================================
// OrderConfirmation Component
// Displays order success and details
// ============================================

import { Link } from 'react-router-dom';
import { 
  CheckCircle, 
  Package, 
  Truck, 
  Calendar,
  Mail,
  Phone,
  MapPin,
  BookOpen
} from 'lucide-react';
import { OrderWithItems } from '../../types';
import { formatPrice, formatDateTime, getEstimatedDelivery, getStatusColor } from '../../utils/formatters';
import { Button } from '../common';

interface OrderConfirmationProps {
  order: OrderWithItems;
}

const OrderConfirmation = ({ order }: OrderConfirmationProps) => {
  // Fallback image
  const ImagePlaceholder = () => (
    <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-200 
                    flex items-center justify-center">
      <BookOpen className="w-6 h-6 text-primary-400" />
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-gray-900 mb-2">
          Order Confirmed!
        </h1>
        <p className="text-gray-600">
          Thank you for your order. We'll send you a confirmation email shortly.
        </p>
      </div>

      {/* Order Number */}
      <div className="bg-literary-parchment rounded-xl p-6 text-center mb-6">
        <p className="text-sm text-gray-600 mb-1">Order Number</p>
        <p className="text-2xl font-bold text-literary-leather">{order.order_number}</p>
      </div>

      {/* Order Status */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Package className="w-6 h-6 text-literary-leather" />
            <div>
              <p className="font-medium text-gray-900">Order Status</p>
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${getStatusColor(order.status)}`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Truck className="w-6 h-6 text-literary-leather" />
            <div>
              <p className="font-medium text-gray-900">Estimated Delivery</p>
              <p className="text-sm text-gray-600">
                {getEstimatedDelivery(order.created_at)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="w-6 h-6 text-literary-leather" />
            <div>
              <p className="font-medium text-gray-900">Order Date</p>
              <p className="text-sm text-gray-600">
                {formatDateTime(order.created_at)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4">Order Items</h2>
        <div className="divide-y divide-gray-200">
          {order.order_items.map((item) => (
            <div key={item.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
              <div className="w-16 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
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
                <h3 className="font-medium text-gray-900">
                  {item.product?.title || 'Unknown Book'}
                </h3>
                <p className="text-sm text-gray-600">{item.product?.author}</p>
                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">
                  {formatPrice(item.price_at_purchase * item.quantity)}
                </p>
                <p className="text-sm text-gray-500">
                  {formatPrice(item.price_at_purchase)} each
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Order Total */}
        <div className="border-t border-gray-200 mt-4 pt-4">
          <div className="flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span className="text-literary-leather">{formatPrice(order.total_amount)}</span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Payment Method: Cash on Delivery
          </p>
        </div>
      </div>

      {/* Customer & Shipping Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Contact Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Contact Information</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-gray-600">
              <Mail className="w-4 h-4" />
              <span>{order.customer_email}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <Phone className="w-4 h-4" />
              <span>{order.customer_phone}</span>
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Shipping Address</h2>
          <div className="flex items-start gap-3 text-gray-600">
            <MapPin className="w-4 h-4 mt-1" />
            <div>
              <p className="font-medium text-gray-900">{order.customer_name}</p>
              <p>{order.shipping_address}</p>
              <p>{order.city}, {order.postal_code}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link to="/products">
          <Button variant="primary">Continue Shopping</Button>
        </Link>
        <Link to={`/track-order?order=${order.order_number}`}>
          <Button variant="outline">Track Order</Button>
        </Link>
      </div>

      {/* Help Text */}
      <p className="text-center text-sm text-gray-500 mt-6">
        Questions about your order? Contact us at{' '}
        <a href="mailto:support@literaryhaven.com" className="text-literary-leather hover:underline">
          support@literaryhaven.com
        </a>
      </p>
    </div>
  );
};

export default OrderConfirmation;
