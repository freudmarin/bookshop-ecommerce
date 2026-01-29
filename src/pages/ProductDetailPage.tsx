// ============================================
// Product Detail Page
// Full product information and add to cart
// ============================================

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { useProducts } from '../hooks/useSupabase';
import { Product } from '../types';
import { ProductDetail as ProductDetailComponent, ProductCard } from '../components/product';
import { Loading, ErrorMessage } from '../components/common';

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { getProductById, getProducts, loading, error } = useProducts();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;
      
      const data = await getProductById(id);
      setProduct(data);

      // Load related products from same category
      if (data) {
        const related = await getProducts({ category: data.category });
        setRelatedProducts(related.filter(p => p.id !== id).slice(0, 4));
      }
    };

    loadProduct();
    // Scroll to top on product change
    window.scrollTo(0, 0);
  }, [id, getProductById, getProducts]);

  if (loading && !product) {
    return <Loading text="Loading book details..." fullScreen variant="book" />;
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-literary-cream py-12">
        <div className="container mx-auto px-4">
          <ErrorMessage
            title="Book Not Found"
            message={error || "We couldn't find the book you're looking for."}
            fullScreen
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-literary-cream">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-literary-leather flex items-center gap-1">
              <Home className="w-4 h-4" />
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/products" className="hover:text-literary-leather">
              Books
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link 
              to={`/products?category=${encodeURIComponent(product.category)}`}
              className="hover:text-literary-leather"
            >
              {product.category}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium truncate max-w-[200px]">
              {product.title}
            </span>
          </nav>
        </div>
      </div>

      {/* Product Detail */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        <ProductDetailComponent product={product} />
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="bg-white py-12">
          <div className="container mx-auto px-4">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-gray-900 mb-6">
              You May Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((book) => (
                <ProductCard key={book.id} product={book} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetailPage;
