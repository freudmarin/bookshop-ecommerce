// ============================================
// ProductList Component
// Displays a grid/list of products
// ============================================

import { Product } from '../../types';
import ProductCard from './ProductCard';
import { EmptyState } from '../common';
import { BookX } from 'lucide-react';

interface ProductListProps {
  products: Product[];
  variant?: 'grid' | 'list';
  emptyMessage?: string;
}

const ProductList = ({
  products,
  variant = 'grid',
  emptyMessage = 'No books found',
}: ProductListProps) => {
  if (products.length === 0) {
    return (
      <EmptyState
        icon={<BookX className="w-10 h-10 text-literary-leather" />}
        title={emptyMessage}
        description="Try adjusting your filters or search terms to find what you're looking for."
      />
    );
  }

  if (variant === 'list') {
    return (
      <div className="space-y-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} variant="list" />
        ))}
      </div>
    );
  }

  // Grid variant (default)
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} variant="grid" />
      ))}
    </div>
  );
};

export default ProductList;
