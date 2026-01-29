// ============================================
// ProductDetail Component
// Full product detail view
// ============================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  Heart, 
  Share2, 
  BookOpen,
  Minus,
  Plus,
  Check,
  Package,
  Truck
} from 'lucide-react';
import { Product } from '../../types';
import { formatPrice, formatISBN } from '../../utils/formatters';
import { useCart } from '../../hooks/useCart';
import { Button } from '../common';

interface ProductDetailProps {
  product: Product;
}

const ProductDetail = ({ product }: ProductDetailProps) => {
  const navigate = useNavigate();
  const { addItem, isInCart, getItemQuantity } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [showAddedMessage, setShowAddedMessage] = useState(false);

  const inCart = isInCart(product.id);
  const cartQuantity = getItemQuantity(product.id);
  const outOfStock = product.stock_quantity <= 0;
  const maxQuantity = Math.min(product.stock_quantity - cartQuantity, 10);

  const handleQuantityChange = (delta: number) => {
    setQuantity(prev => Math.max(1, Math.min(maxQuantity, prev + delta)));
  };

  const handleAddToCart = () => {
    addItem(product, quantity);
    setShowAddedMessage(true);
    setTimeout(() => setShowAddedMessage(false), 2000);
  };

  const handleBuyNow = () => {
    addItem(product, quantity);
    navigate('/cart');
  };

  // Fallback image
  const ImagePlaceholder = () => (
    <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-200 
                    flex items-center justify-center rounded-xl">
      <BookOpen className="w-24 h-24 text-primary-400" />
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
      {/* Image Section */}
      <div className="space-y-4">
        <div className="aspect-[3/4] bg-white rounded-xl shadow-sm overflow-hidden">
          {product.cover_image_url ? (
            <img
              src={product.cover_image_url}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <ImagePlaceholder />
          )}
        </div>
      </div>

      {/* Details Section */}
      <div className="space-y-6">
        {/* Category Badge */}
        <span className="inline-block px-3 py-1 bg-accent-100 text-accent-700 
                         rounded-full text-sm font-medium">
          {product.category}
        </span>

        {/* Title and Author */}
        <div>
          <h1 className="font-serif text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            {product.title}
          </h1>
          <p className="text-xl text-gray-600">by {product.author}</p>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-bold text-literary-leather">
            {formatPrice(product.price)}
          </span>
          <span className={`text-sm font-medium ${
            outOfStock ? 'text-red-600' : 'text-green-600'
          }`}>
            {outOfStock 
              ? 'Out of Stock' 
              : product.stock_quantity <= 5 
                ? `Only ${product.stock_quantity} left!` 
                : 'In Stock'
            }
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-600 leading-relaxed">
          {product.description}
        </p>

        {/* Book Details */}
        <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-gray-200">
          {product.publisher && (
            <div>
              <span className="text-sm text-gray-500 block">Publisher</span>
              <span className="font-medium">{product.publisher}</span>
            </div>
          )}
          {product.publication_year && (
            <div>
              <span className="text-sm text-gray-500 block">Year</span>
              <span className="font-medium">{product.publication_year}</span>
            </div>
          )}
          {product.page_count && (
            <div>
              <span className="text-sm text-gray-500 block">Pages</span>
              <span className="font-medium">{product.page_count}</span>
            </div>
          )}
          {product.isbn && (
            <div>
              <span className="text-sm text-gray-500 block">ISBN</span>
              <span className="font-medium">{formatISBN(product.isbn)}</span>
            </div>
          )}
        </div>

        {/* Quantity Selector */}
        {!outOfStock && (
          <div className="flex items-center gap-4">
            <span className="text-gray-700 font-medium">Quantity:</span>
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
                className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-4 py-2 font-medium min-w-[3rem] text-center">
                {quantity}
              </span>
              <button
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= maxQuantity}
                className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {inCart && (
              <span className="text-sm text-gray-500">
                ({cartQuantity} already in cart)
              </span>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleAddToCart}
            disabled={outOfStock || maxQuantity <= 0}
            leftIcon={showAddedMessage ? <Check className="w-5 h-5" /> : <ShoppingCart className="w-5 h-5" />}
          >
            {showAddedMessage 
              ? 'Added to Cart!' 
              : outOfStock 
                ? 'Out of Stock' 
                : maxQuantity <= 0 
                  ? 'Max in Cart'
                  : 'Add to Cart'
            }
          </Button>
          <Button
            variant="secondary"
            size="lg"
            fullWidth
            onClick={handleBuyNow}
            disabled={outOfStock}
          >
            Buy Now
          </Button>
        </div>

        {/* Secondary Actions */}
        <div className="flex items-center gap-4 pt-2">
          <button className="flex items-center gap-2 text-gray-600 hover:text-literary-leather transition-colors">
            <Heart className="w-5 h-5" />
            <span className="text-sm">Add to Wishlist</span>
          </button>
          <button className="flex items-center gap-2 text-gray-600 hover:text-literary-leather transition-colors">
            <Share2 className="w-5 h-5" />
            <span className="text-sm">Share</span>
          </button>
        </div>

        {/* Shipping Info */}
        <div className="bg-literary-parchment rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-3 text-gray-700">
            <Truck className="w-5 h-5 text-literary-leather" />
            <span className="text-sm">Free shipping on orders over $35</span>
          </div>
          <div className="flex items-center gap-3 text-gray-700">
            <Package className="w-5 h-5 text-literary-leather" />
            <span className="text-sm">Pay on delivery available</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
