// ============================================
// CheckoutForm Component
// Customer details form for checkout
// ============================================

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building2, 
  Hash,
  FileText
} from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import { useOrders, useProducts } from '../../hooks/useSupabase';
import { supabase } from '../../lib/supabaseClient';
import { CheckoutFormData } from '../../types';
import { Input, Textarea, Button } from '../common';

interface FormErrors {
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  shipping_address?: string;
  city?: string;
  postal_code?: string;
}

const CheckoutForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, total, clearCart } = useCart();
  const { createOrder, loading: orderLoading, error: orderError } = useOrders();
  const { checkStockAvailability } = useProducts();

  const [formData, setFormData] = useState<CheckoutFormData>({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    shipping_address: '',
    city: '',
    postal_code: '',
    notes: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stockError, setStockError] = useState<string | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  // Load user profile data if authenticated
  useEffect(() => {
    const loadUserProfile = async () => {
      if (!user) return;

      setLoadingProfile(true);
      try {
        const { data: profile, error } = await supabase
          .from('users')
          .select('full_name, phone, default_address, default_city, default_postal_code')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error loading profile:', error);
          return;
        }

        if (profile) {
          setFormData({
            customer_name: profile.full_name || user.user_metadata?.full_name || '',
            customer_email: user.email || '',
            customer_phone: profile.phone || '',
            shipping_address: profile.default_address || '',
            city: profile.default_city || '',
            postal_code: profile.default_postal_code || '',
            notes: '',
          });
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        setLoadingProfile(false);
      }
    };

    loadUserProfile();
  }, [user]);

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.customer_name.trim()) {
      newErrors.customer_name = 'Full name is required';
    }

    if (!formData.customer_email.trim()) {
      newErrors.customer_email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customer_email)) {
      newErrors.customer_email = 'Please enter a valid email address';
    }

    if (!formData.customer_phone.trim()) {
      newErrors.customer_phone = 'Phone number is required';
    } else if (!/^[\d\s\-+()]{10,}$/.test(formData.customer_phone)) {
      newErrors.customer_phone = 'Please enter a valid phone number';
    }

    if (!formData.shipping_address.trim()) {
      newErrors.shipping_address = 'Shipping address is required';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.postal_code.trim()) {
      newErrors.postal_code = 'Postal code is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    if (items.length === 0) return;

    setIsSubmitting(true);
    setStockError(null);

    try {
      // Check stock availability
      const stockCheck = await checkStockAvailability(
        items.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
        }))
      );

      if (!stockCheck.available) {
        setStockError(
          `Some items are out of stock or have insufficient quantity: ${stockCheck.unavailableItems.join(', ')}`
        );
        setIsSubmitting(false);
        return;
      }

      // Create order
      const order = await createOrder({
        ...formData,
        total_amount: total,
        items: items.map(item => ({
          product_id: item.product.id,
          quantity: item.quantity,
          price_at_purchase: item.product.price,
        })),
      });

      if (order) {
        // Clear cart and navigate to confirmation
        clearCart();
        navigate(`/order-confirmation/${order.order_number}`);
      }
    } catch (err) {
      console.error('Checkout error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error Messages */}
      {(orderError || stockError) && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {orderError || stockError}
        </div>
      )}

      {/* Customer Information */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Customer Information
        </h2>
        
        <div className="space-y-4">
          <Input
            label="Full Name"
            name="customer_name"
            value={formData.customer_name}
            onChange={handleChange}
            placeholder="John Doe"
            error={errors.customer_name}
            leftIcon={<User className="w-4 h-4" />}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Email Address"
              name="customer_email"
              type="email"
              value={formData.customer_email}
              onChange={handleChange}
              placeholder="john@example.com"
              error={errors.customer_email}
              leftIcon={<Mail className="w-4 h-4" />}
              required
            />

            <Input
              label="Phone Number"
              name="customer_phone"
              type="tel"
              value={formData.customer_phone}
              onChange={handleChange}
              placeholder="+1 (123) 456-7890"
              error={errors.customer_phone}
              leftIcon={<Phone className="w-4 h-4" />}
              required
            />
          </div>
        </div>
      </div>

      {/* Shipping Address */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Shipping Address
        </h2>
        
        <div className="space-y-4">
          <Input
            label="Street Address"
            name="shipping_address"
            value={formData.shipping_address}
            onChange={handleChange}
            placeholder="123 Main Street, Apt 4B"
            error={errors.shipping_address}
            leftIcon={<MapPin className="w-4 h-4" />}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="City"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="New York"
              error={errors.city}
              leftIcon={<Building2 className="w-4 h-4" />}
              required
            />

            <Input
              label="Postal Code"
              name="postal_code"
              value={formData.postal_code}
              onChange={handleChange}
              placeholder="10001"
              error={errors.postal_code}
              leftIcon={<Hash className="w-4 h-4" />}
              required
            />
          </div>
        </div>
      </div>

      {/* Order Notes */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Order Notes (Optional)
        </h2>
        
        <Textarea
          name="notes"
          value={formData.notes || ''}
          onChange={handleChange}
          placeholder="Any special instructions for delivery..."
          rows={3}
        />
      </div>

      {/* Payment Method */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Payment Method
        </h2>
        
        <div className="flex items-center gap-3 p-4 bg-literary-parchment rounded-lg border-2 border-literary-leather">
          <div className="w-10 h-10 bg-literary-leather rounded-full flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-medium text-gray-900">Cash on Delivery</p>
            <p className="text-sm text-gray-600">
              Pay when your order arrives at your doorstep
            </p>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        disabled={isSubmitting || items.length === 0}
        isLoading={isSubmitting}
      >
        {isSubmitting ? 'Placing Order...' : 'Place Order'}
      </Button>

      <p className="text-sm text-gray-500 text-center">
        By placing your order, you agree to our Terms of Service and Privacy Policy.
      </p>
    </form>
  );
};

export default CheckoutForm;
