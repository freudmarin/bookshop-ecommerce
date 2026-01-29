// ============================================
// Order Confirmation Page
// Displays order success and details
// ============================================

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useOrders } from '../hooks/useSupabase';
import { OrderWithItems } from '../types';
import { OrderConfirmation as OrderConfirmationComponent } from '../components/checkout';
import { Loading, ErrorMessage, Button } from '../components/common';

const OrderConfirmationPage = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const { getOrderByNumber, loading, error } = useOrders();
  const [order, setOrder] = useState<OrderWithItems | null>(null);

  useEffect(() => {
    const loadOrder = async () => {
      if (!orderNumber) return;
      const data = await getOrderByNumber(orderNumber);
      setOrder(data);
    };

    loadOrder();
  }, [orderNumber, getOrderByNumber]);

  if (loading) {
    return <Loading text="Loading order details..." fullScreen variant="book" />;
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-literary-cream py-12">
        <div className="container mx-auto px-4">
          <ErrorMessage
            title="Order Not Found"
            message={error || "We couldn't find this order. Please check your order number."}
            fullScreen
          />
          <div className="text-center mt-6">
            <Link to="/">
              <Button variant="primary">Return Home</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-literary-cream py-12">
      <div className="container mx-auto px-4">
        <OrderConfirmationComponent order={order} />
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
