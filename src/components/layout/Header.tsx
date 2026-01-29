// ============================================
// Header Component
// Main navigation header with cart and search
// ============================================

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  Search, 
  Menu, 
  X, 
  BookOpen,
  User,
  LogOut,
  Settings,
  Package,
  Shield
} from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { totalItems } = useCart();
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMenuOpen(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'All Books', path: '/products' },
    { label: 'Fiction', path: '/products?category=Fiction' },
    { label: 'Non-Fiction', path: '/products?category=Non-Fiction' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Top Bar */}
      <div className="bg-literary-leather text-white py-2">
        <div className="container mx-auto px-4 text-center text-sm">
          📚 Free shipping on orders over $35! | Pay on Delivery Available
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2 text-literary-leather hover:text-literary-burgundy transition-colors"
          >
            <BookOpen className="w-8 h-8" />
            <div className="hidden sm:block">
              <h1 className="font-serif text-xl font-bold leading-tight">
                The Literary Haven
              </h1>
              <p className="text-xs text-gray-500">Books for every reader</p>
            </div>
          </Link>

          {/* Desktop Search */}
          <form 
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-md mx-8"
          >
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search books, authors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-literary-leather/20 
                         focus:border-literary-leather transition-colors"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </form>

          {/* Desktop Actions */}
          <div className="flex items-center gap-4">
            {/* User Menu - Desktop */}
            {user ? (
              <div className="relative hidden md:block">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-2 text-gray-600 hover:text-literary-leather transition-colors"
                  aria-label="User menu"
                >
                  <div className="w-8 h-8 bg-literary-leather rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-medium">
                    {user.user_metadata?.full_name?.split(' ')[0] || 'Account'}
                  </span>
                </button>

                {/* User Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-ink">
                        {user.user_metadata?.full_name || 'User'}
                      </p>
                      <p className="text-xs text-gray-600 truncate">
                        {user.email}
                      </p>
                    </div>
                    <Link
                      to="/dashboard"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <User className="w-4 h-4" />
                      Dashboard
                    </Link>
                    <Link
                      to="/dashboard/orders"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Package className="w-4 h-4" />
                      My Orders
                    </Link>
                    <Link
                      to="/dashboard/profile"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Settings className="w-4 h-4" />
                      Profile Settings
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin/orders"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 border-t border-gray-100"
                      >
                        <Shield className="w-4 h-4" />
                        Admin Orders
                      </Link>
                    )}
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 border-t border-gray-100 mt-1"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden md:flex items-center gap-1 text-gray-600 hover:text-literary-leather transition-colors"
              >
                <User className="w-5 h-5" />
                <span className="text-sm">Sign In</span>
              </Link>
            )}

            {/* Track Order (for non-authenticated users) */}
            {!user && (
              <Link
                to="/track-order"
                className="hidden md:flex items-center gap-1 text-gray-600 hover:text-literary-leather transition-colors"
              >
                <Package className="w-5 h-5" />
                <span className="text-sm">Track Order</span>
              </Link>
            )}

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 text-gray-600 hover:text-literary-leather transition-colors"
              aria-label={`Shopping cart with ${totalItems} items`}
            >
              <ShoppingCart className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent-500 text-white 
                               text-xs font-bold rounded-full flex items-center justify-center">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-literary-leather transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:block border-t border-gray-100">
          <ul className="flex items-center gap-8 py-3">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className="text-gray-600 hover:text-literary-leather font-medium transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="container mx-auto px-4 py-4">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search books, authors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg
                           focus:outline-none focus:ring-2 focus:ring-literary-leather/20 
                           focus:border-literary-leather"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </form>

            {/* Mobile Navigation */}
            <nav>
              <ul className="space-y-2">
                {navLinks.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      onClick={() => setIsMenuOpen(false)}
                      className="block py-2 text-gray-600 hover:text-literary-leather font-medium transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
                
                {/* Mobile User Menu */}
                {user ? (
                  <>
                    <li className="pt-2 border-t border-gray-200">
                      <Link
                        to="/dashboard"
                        onClick={() => setIsMenuOpen(false)}
                        className="block py-2 text-gray-600 hover:text-literary-leather font-medium transition-colors"
                      >
                        Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/dashboard/orders"
                        onClick={() => setIsMenuOpen(false)}
                        className="block py-2 text-gray-600 hover:text-literary-leather font-medium transition-colors"
                      >
                        My Orders
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/dashboard/profile"
                        onClick={() => setIsMenuOpen(false)}
                        className="block py-2 text-gray-600 hover:text-literary-leather font-medium transition-colors"
                      >
                        Profile Settings
                      </Link>
                    </li>
                    {isAdmin && (
                      <li>
                        <Link
                          to="/admin/orders"
                          onClick={() => setIsMenuOpen(false)}
                          className="block py-2 text-gray-600 hover:text-literary-leather font-medium transition-colors"
                        >
                          Admin Orders
                        </Link>
                      </li>
                    )}
                    <li>
                      <button
                        onClick={() => {
                          setIsMenuOpen(false);
                          handleSignOut();
                        }}
                        className="block w-full text-left py-2 text-red-600 hover:text-red-700 font-medium transition-colors"
                      >
                        Sign Out
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="pt-2 border-t border-gray-200">
                      <Link
                        to="/login"
                        onClick={() => setIsMenuOpen(false)}
                        className="block py-2 text-gray-600 hover:text-literary-leather font-medium transition-colors"
                      >
                        Sign In
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/register"
                        onClick={() => setIsMenuOpen(false)}
                        className="block py-2 text-gray-600 hover:text-literary-leather font-medium transition-colors"
                      >
                        Create Account
                      </Link>
                    </li>
                  </>
                )}

                <li>
                  <Link
                    to="/track-order"
                    onClick={() => setIsMenuOpen(false)}
                    className="block py-2 text-gray-600 hover:text-literary-leather font-medium transition-colors"
                  >
                    Track Order
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
