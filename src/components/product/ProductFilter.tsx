// ============================================
// ProductFilter Component
// Sidebar filters for product listing
// ============================================

import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import { CategoryCount, ProductFilters } from '../../types';
import { Button } from '../common';

interface ProductFilterProps {
  categories: CategoryCount[];
  onFilterChange: (filters: ProductFilters) => void;
  initialFilters?: ProductFilters;
}

const ProductFilter = ({
  categories,
  onFilterChange,
  initialFilters = {},
}: ProductFilterProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    price: true,
    sort: true,
  });

  // Local filter state
  const [filters, setFilters] = useState<ProductFilters>({
    categories: searchParams.getAll('category').length > 0 
      ? searchParams.getAll('category') 
      : (initialFilters.categories || []),
    minPrice: initialFilters.minPrice,
    maxPrice: initialFilters.maxPrice,
    sortBy: (searchParams.get('sort') as ProductFilters['sortBy']) || initialFilters.sortBy || 'newest',
  });

  // Sync with URL params
  useEffect(() => {
    const categories = searchParams.getAll('category');
    const sort = searchParams.get('sort') as ProductFilters['sortBy'];
    
    if (categories.length > 0 || sort) {
      setFilters(prev => ({
        ...prev,
        categories: categories.length > 0 ? categories : prev.categories,
        sortBy: sort || prev.sortBy,
      }));
    }
  }, [searchParams]);

  // Apply filters
  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  const handleCategoryChange = (category: string) => {
    const currentCategories = filters.categories || [];
    const newCategories = currentCategories.includes(category)
      ? currentCategories.filter(c => c !== category)
      : [...currentCategories, category];
    
    setFilters(prev => ({ ...prev, categories: newCategories }));
    
    // Update URL with all selected categories
    const newParams = new URLSearchParams(searchParams);
    
    // Remove old category params
    newParams.delete('category');
    newParams.delete('categories');
    
    // Add new categories
    if (newCategories.length > 0) {
      // Use multiple category params or comma-separated
      newCategories.forEach(cat => {
        newParams.append('category', cat);
      });
    }
    
    setSearchParams(newParams);
  };

  const handlePriceChange = (type: 'min' | 'max', value: string) => {
    const numValue = value ? parseFloat(value) : undefined;
    setFilters(prev => ({
      ...prev,
      [type === 'min' ? 'minPrice' : 'maxPrice']: numValue,
    }));
  };

  const handleSortChange = (sortBy: ProductFilters['sortBy']) => {
    setFilters(prev => ({ ...prev, sortBy }));
    
    // Update URL
    const newParams = new URLSearchParams(searchParams);
    if (sortBy && sortBy !== 'newest') {
      newParams.set('sort', sortBy);
    } else {
      newParams.delete('sort');
    }
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setFilters({
      sortBy: 'newest',
    });
    setSearchParams(new URLSearchParams());
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const hasActiveFilters = (filters.categories && filters.categories.length > 0) || filters.minPrice || filters.maxPrice;

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Category Filter */}
      <div className="border-b border-gray-200 pb-6">
        <button
          onClick={() => toggleSection('category')}
          className="flex items-center justify-between w-full text-left"
        >
          <h3 className="font-semibold text-gray-900">Categories</h3>
          {expandedSections.category ? (
            <ChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )}
        </button>
        
        {expandedSections.category && (
          <div className="mt-4 space-y-2">
            {categories.map((cat) => (
              <label
                key={cat.category}
                className="flex items-center gap-2 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={(filters.categories || []).includes(cat.category)}
                  onChange={() => handleCategoryChange(cat.category)}
                  className="w-4 h-4 rounded border-gray-300 text-literary-leather 
                           focus:ring-literary-leather"
                />
                <span className="text-sm text-gray-700 group-hover:text-literary-leather">
                  {cat.category}
                </span>
                <span className="text-xs text-gray-400 ml-auto">({cat.count})</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price Filter */}
      <div className="border-b border-gray-200 pb-6">
        <button
          onClick={() => toggleSection('price')}
          className="flex items-center justify-between w-full text-left"
        >
          <h3 className="font-semibold text-gray-900">Price Range</h3>
          {expandedSections.price ? (
            <ChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )}
        </button>
        
        {expandedSections.price && (
          <div className="mt-4 flex items-center gap-2">
            <div className="flex-1">
              <input
                type="number"
                placeholder="Min"
                value={filters.minPrice || ''}
                onChange={(e) => handlePriceChange('min', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm
                         focus:outline-none focus:ring-2 focus:ring-literary-leather/20 
                         focus:border-literary-leather"
                min="0"
              />
            </div>
            <span className="text-gray-400">—</span>
            <div className="flex-1">
              <input
                type="number"
                placeholder="Max"
                value={filters.maxPrice || ''}
                onChange={(e) => handlePriceChange('max', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm
                         focus:outline-none focus:ring-2 focus:ring-literary-leather/20 
                         focus:border-literary-leather"
                min="0"
              />
            </div>
          </div>
        )}
      </div>

      {/* Sort Filter */}
      <div>
        <button
          onClick={() => toggleSection('sort')}
          className="flex items-center justify-between w-full text-left"
        >
          <h3 className="font-semibold text-gray-900">Sort By</h3>
          {expandedSections.sort ? (
            <ChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )}
        </button>
        
        {expandedSections.sort && (
          <div className="mt-4 space-y-2">
            {[
              { value: 'newest', label: 'Newest First' },
              { value: 'price_asc', label: 'Price: Low to High' },
              { value: 'price_desc', label: 'Price: High to Low' },
              { value: 'title', label: 'Title: A to Z' },
            ].map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-2 cursor-pointer group"
              >
                <input
                  type="radio"
                  name="sort"
                  checked={filters.sortBy === option.value}
                  onChange={() => handleSortChange(option.value as ProductFilters['sortBy'])}
                  className="w-4 h-4 border-gray-300 text-literary-leather 
                           focus:ring-literary-leather"
                />
                <span className="text-sm text-gray-700 group-hover:text-literary-leather">
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          fullWidth
          onClick={clearFilters}
          leftIcon={<X className="w-4 h-4" />}
        >
          Clear All Filters
        </Button>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-4">
        <Button
          variant="outline"
          onClick={() => setIsOpen(true)}
          leftIcon={<Filter className="w-4 h-4" />}
        >
          Filters {hasActiveFilters && '(Active)'}
        </Button>
      </div>

      {/* Mobile Filter Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-white p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Filters</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <FilterContent />
          </div>
        </div>
      )}

      {/* Desktop Filter Sidebar */}
      <div className="hidden lg:block w-64 flex-shrink-0">
        <div className="sticky top-24 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </h2>
          <FilterContent />
        </div>
      </div>
    </>
  );
};

export default ProductFilter;
