// ============================================
// Products Page
// Product listing with filters and search
// ============================================

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Grid, List } from 'lucide-react';
import { useProducts } from '../hooks/useSupabase';
import { Product, ProductFilters, CategoryCount } from '../types';
import { ProductList, ProductFilter } from '../components/product';
import { Loading, ErrorMessage, Button } from '../components/common';

const Products = () => {
  const [searchParams] = useSearchParams();
  const { getProducts, getCategories, loading, error } = useProducts();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryCount[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState<ProductFilters>({});

  // Get initial search query from URL
  const searchQuery = searchParams.get('search');

  // Load categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      const cats = await getCategories();
      setCategories(cats);
    };
    loadCategories();
  }, [getCategories]);

  // Load products when filters change
  useEffect(() => {
    const loadProducts = async () => {
      const appliedFilters = {
        ...filters,
        search: searchQuery || filters.search,
      };
      const data = await getProducts(appliedFilters);
      setProducts(data);
    };
    loadProducts();
  }, [filters, searchQuery, getProducts]);

  // Handle filter changes
  const handleFilterChange = useCallback((newFilters: ProductFilters) => {
    setFilters(newFilters);
  }, []);

  // Page title based on filters
  const getPageTitle = () => {
    if (searchQuery) return `Search results for "${searchQuery}"`;
    if (filters.categories && filters.categories.length > 0) {
      return filters.categories.length === 1 
        ? filters.categories[0]
        : `${filters.categories.length} Categories`;
    }
    return 'All Books';
  };

  return (
    <div className="min-h-screen bg-literary-cream">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-8">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {getPageTitle()}
          </h1>
          <p className="text-gray-600">
            {loading ? 'Searching...' : `${products.length} books found`}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <ProductFilter
            categories={categories}
            onFilterChange={handleFilterChange}
            initialFilters={filters}
          />

          {/* Products Area */}
          <div className="flex-1">
            {/* View Toggle & Sort (Desktop) */}
            <div className="hidden lg:flex items-center justify-between mb-6">
              <p className="text-gray-600">
                Showing {products.length} results
              </p>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">View:</span>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-literary-leather text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  aria-label="Grid view"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-literary-leather text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  aria-label="List view"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Loading State */}
            {loading && products.length === 0 && (
              <Loading text="Loading books..." variant="book" />
            )}

            {/* Error State */}
            {error && !loading && (
              <ErrorMessage 
                message={error} 
                onRetry={() => handleFilterChange(filters)} 
              />
            )}

            {/* Products */}
            {!loading && !error && (
              <ProductList 
                products={products} 
                variant={viewMode}
                emptyMessage={
                  searchQuery 
                    ? `No books found for "${searchQuery}"` 
                    : 'No books found matching your criteria'
                }
              />
            )}

            {/* Loading overlay for filter changes */}
            {loading && products.length > 0 && (
              <div className="fixed inset-0 bg-white/50 flex items-center justify-center z-10">
                <Loading text="Updating..." size="sm" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
