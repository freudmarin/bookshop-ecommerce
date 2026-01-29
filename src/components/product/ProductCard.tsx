// ============================================
// ProductCard Component
// Displays a single product in grid/list view
// ============================================

import { Link } from 'react-router-dom';
import { ShoppingCart, BookOpen } from 'lucide-react';
import { Product } from '../../types';
import { formatPrice, truncateText } from '../../utils/formatters';
import { useCart } from '../../hooks/useCart';
import { Button } from '../common';

interface ProductCardProps {
  product: Product;
  variant?: 'grid' | 'list';
}

const ProductCard = ({ product, variant = 'grid' }: ProductCardProps) => {
  const { addItem, isInCart } = useCart();
  const inCart = isInCart(product.id);
  const outOfStock = product.stock_quantity <= 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!outOfStock) {
      addItem(product, 1);
    }
  };

  // Fallback image component
  const ImagePlaceholder = () => (
    <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-200 
                    flex items-center justify-center">
      <BookOpen className="w-16 h-16 text-primary-400" />
    </div>
  );

  if (variant === 'list') {
    return (
      <Link
        to={`/products/${product.id}`}
        className="flex gap-4 bg-white rounded-xl shadow-sm hover:shadow-md 
                   transition-shadow p-4 border border-gray-100"
      >
        {/* Image */}
        <div className="w-24 h-36 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
          {product.cover_image_url ? (
            <img
              src={product.cover_image_url}
              alt={product.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <ImagePlaceholder />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col">
          <span className="text-xs text-accent-600 font-medium mb-1">
            {product.category}
          </span>
          <h3 className="font-serif text-lg font-semibold text-gray-900 mb-1">
            {product.title}
          </h3>
          <p className="text-sm text-gray-600 mb-2">by {product.author}</p>
          <p className="text-sm text-gray-500 line-clamp-2 mb-auto">
            {product.description}
          </p>
          <div className="flex items-center justify-between mt-3">
            <span className="text-xl font-bold text-literary-leather">
              {formatPrice(product.price)}
            </span>
            <Button
              variant={inCart ? 'secondary' : 'primary'}
              size="sm"
              onClick={handleAddToCart}
              disabled={outOfStock}
              leftIcon={<ShoppingCart className="w-4 h-4" />}
            >
              {outOfStock ? 'Out of Stock' : inCart ? 'In Cart' : 'Add'}
            </Button>
          </div>
        </div>
      </Link>
    );
  }

  // Grid variant (default)
  return (
    <Link
      to={`/products/${product.id}`}
      className="group bg-white rounded-xl shadow-sm hover:shadow-lg 
                 transition-all duration-300 overflow-hidden border border-gray-100
                 flex flex-col"
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
        {product.cover_image_url ? (
          <img
            src={product.cover_image_url}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 
                       transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <ImagePlaceholder />
        )}
        
        {/* Category Badge */}
        <span className="absolute top-3 left-3 px-2 py-1 bg-white/90 backdrop-blur-sm 
                         rounded-full text-xs font-medium text-literary-leather">
          {product.category.split(' - ')[0]}
        </span>

        {/* Out of Stock Overlay */}
        {outOfStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="px-4 py-2 bg-white rounded-lg font-medium text-gray-900">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-serif text-lg font-semibold text-gray-900 
                       group-hover:text-literary-leather transition-colors line-clamp-2 mb-1">
          {product.title}
        </h3>
        <p className="text-sm text-gray-600 mb-2">by {product.author}</p>
        <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">
          {truncateText(product.description || '', 80)}
        </p>

        {/* Price and Action */}
        <div className="flex items-center justify-between mt-auto">
          <span className="text-xl font-bold text-literary-leather">
            {formatPrice(product.price)}
          </span>
          <button
            onClick={handleAddToCart}
            disabled={outOfStock}
            className={`p-2 rounded-full transition-colors ${
              outOfStock
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : inCart
                ? 'bg-accent-500 text-white'
                : 'bg-literary-leather text-white hover:bg-literary-burgundy'
            }`}
            aria-label={outOfStock ? 'Out of stock' : inCart ? 'In cart' : 'Add to cart'}
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
