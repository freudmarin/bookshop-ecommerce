// ============================================
// Home Page
// Landing page with featured books and categories
// ============================================

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  ArrowRight, 
  Truck, 
  CreditCard, 
  RefreshCw,
  Star 
} from 'lucide-react';
import { useProducts } from '../hooks/useSupabase';
import { Product, CategoryCount } from '../types';
import { ProductCard } from '../components/product';
import { Button, Loading, ErrorMessage } from '../components/common';

const Home = () => {
  const { getProducts, getCategories, getFeaturedProducts, loading, error } = useProducts();
  const [featuredBooks, setFeaturedBooks] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryCount[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);

  useEffect(() => {
    const loadHomeData = async () => {
      const [featured, cats, arrivals] = await Promise.all([
        getFeaturedProducts(4),
        getCategories(),
        getProducts({ sortBy: 'newest' }),
      ]);
      
      setFeaturedBooks(featured);
      setCategories(cats);
      setNewArrivals(arrivals.slice(0, 8));
    };

    loadHomeData();
  }, [getProducts, getCategories, getFeaturedProducts]);

  if (loading && featuredBooks.length === 0) {
    return <Loading text="Loading bookshop..." fullScreen variant="book" />;
  }

  if (error) {
    return <ErrorMessage message={error} fullScreen />;
  }

  // Features data
  const features = [
    {
      icon: <Truck className="w-6 h-6" />,
      title: 'Free Shipping',
      description: 'On orders over $35',
    },
    {
      icon: <CreditCard className="w-6 h-6" />,
      title: 'Pay on Delivery',
      description: 'No upfront payment needed',
    },
    {
      icon: <RefreshCw className="w-6 h-6" />,
      title: 'Easy Returns',
      description: '30-day return policy',
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: 'Quality Books',
      description: 'Handpicked collection',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-literary-leather to-literary-burgundy text-white overflow-hidden">
        <div className="absolute inset-0 bg-book-pattern opacity-10" />
        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="max-w-3xl">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Discover Your Next<br />
              <span className="text-accent-400">Great Read</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl">
              Welcome to The Literary Haven, where every book opens a new world. 
              Explore our curated collection of timeless classics and modern favorites.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/products">
                <Button variant="secondary" size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                  Browse Collection
                </Button>
              </Link>
              <Link to="/products?category=Fiction%20-%20Classics">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-literary-leather">
                  Shop Classics
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Decorative book illustration */}
        <div className="hidden lg:block absolute right-10 bottom-0 opacity-20">
          <BookOpen className="w-96 h-96" />
        </div>
      </section>

      {/* Features Bar */}
      <section className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-literary-leather">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 md:py-16 bg-literary-parchment">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Browse by Category
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find your perfect book from our diverse collection of genres
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.slice(0, 8).map((cat) => (
              <Link
                key={cat.category}
                to={`/products?category=${encodeURIComponent(cat.category)}`}
                className="group p-6 bg-white rounded-xl shadow-sm hover:shadow-md 
                         transition-all duration-300 border border-gray-100 text-center"
              >
                <h3 className="font-semibold text-gray-900 group-hover:text-literary-leather 
                             transition-colors mb-1">
                  {cat.category}
                </h3>
                <p className="text-sm text-gray-500">{cat.count} books</p>
              </Link>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Link to="/products">
              <Button variant="outline" rightIcon={<ArrowRight className="w-4 h-4" />}>
                View All Categories
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Books Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Featured Books
              </h2>
              <p className="text-gray-600">Handpicked favorites from our collection</p>
            </div>
            <Link to="/products" className="hidden md:inline-flex">
              <Button variant="ghost" rightIcon={<ArrowRight className="w-4 h-4" />}>
                View All
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredBooks.map((book) => (
              <ProductCard key={book.id} product={book} />
            ))}
          </div>
          
          <div className="text-center mt-8 md:hidden">
            <Link to="/products">
              <Button variant="outline" rightIcon={<ArrowRight className="w-4 h-4" />}>
                View All Books
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                New Arrivals
              </h2>
              <p className="text-gray-600">The latest additions to our shelves</p>
            </div>
            <Link to="/products?sort=newest" className="hidden md:inline-flex">
              <Button variant="ghost" rightIcon={<ArrowRight className="w-4 h-4" />}>
                View All
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals.slice(0, 4).map((book) => (
              <ProductCard key={book.id} product={book} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
