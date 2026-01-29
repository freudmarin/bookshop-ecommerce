// ============================================
// Dashboard Page
// User dashboard with quick links and overview
// ============================================

import { Link } from 'react-router-dom';
import { User, Package, Heart, Settings, ShoppingBag } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/common/Button';

const Dashboard = () => {
  const { user } = useAuth();

  const quickLinks = [
    {
      title: 'My Orders',
      description: 'View and track your orders',
      icon: Package,
      path: '/dashboard/orders',
      color: 'bg-blue-500',
    },
    {
      title: 'Profile',
      description: 'Manage your account details',
      icon: User,
      path: '/dashboard/profile',
      color: 'bg-green-500',
    },
    {
      title: 'Wishlist',
      description: 'Books you want to read',
      icon: Heart,
      path: '/dashboard/wishlist',
      color: 'bg-red-500',
    },
    {
      title: 'Settings',
      description: 'Update your preferences',
      icon: Settings,
      path: '/dashboard/settings',
      color: 'bg-gray-500',
    },
  ];

  return (
    <div className="min-h-screen bg-parchment py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-ink mb-2">
            Welcome back, {user?.user_metadata?.full_name || 'Reader'}!
          </h1>
          <p className="text-gray-600">
            Manage your account and explore your literary journey
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 group"
              >
                <div className={`${link.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-ink mb-1">
                  {link.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {link.description}
                </p>
              </Link>
            );
          })}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-serif font-bold text-ink mb-4">
            Recent Activity
          </h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-4 py-4 border-b last:border-b-0">
              <div className="bg-literary-leather/10 rounded-full p-2">
                <Package className="h-5 w-5 text-literary-leather" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-ink">
                  No recent orders
                </p>
                <p className="text-sm text-gray-600">
                  Start shopping to see your order history here
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Continue Shopping */}
        <div className="bg-gradient-to-r from-literary-leather to-literary-leather-dark rounded-lg shadow-md p-8 text-center">
          <ShoppingBag className="h-12 w-12 text-white mx-auto mb-4" />
          <h2 className="text-2xl font-serif font-bold text-white mb-2">
            Discover Your Next Great Read
          </h2>
          <p className="text-white/90 mb-6">
            Browse our collection of carefully curated books
          </p>
          <Link to="/products">
            <Button variant="secondary" size="lg">
              Browse Books
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
