"use client";

import { useState, useMemo, useEffect } from "react";
import { animate, AnimatePresence, easeOut, motion } from "motion/react";
import {
  ArrowUpAZ,
  ArrowDownZA,
  SlidersHorizontal,
  ChevronDown,
  Star,
} from "lucide-react";
import { api } from "../lib/axios";
import { Product } from "../lib/products";
import { useSearch } from "@/context/SearchContext";
import Link from "next/link";
import useSWR from "swr";
import Pagination from "./Pagination";

// Fetch products function
const getProducts = async (): Promise<Product[]> => {
  const res = await api.get("/products");
  return res.data.products;
};

// Sorting options type
type SortOption =
  | "a-z"
  | "z-a"
  | "price-low-high"
  | "price-high-low"
  | "rating-high-low";

const ProductPage = () => {
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState<SortOption>("a-z");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    minRating: "",
    tags: [] as string[],
  });
  const [currentPage, setCurrentPage] = useState(1);

  const { searchQuery, setSearchQuery } = useSearch(); // from context

  // using swr for data fetching and caching
  const {
    data: products = [],
    isLoading,
    error,
  } = useSWR("/products", getProducts, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 60 * 1000,
    keepPreviousData: true,
  });

  const ITEM_PER_PAGE = 6;

  useEffect(() => {
    console.log("Is Loading.... ", isLoading);
  }, [isLoading]);

  // Apply sorting and filtering whenever dependencies change
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // search ->
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter((product) => {
        if (product.title.toLowerCase().includes(query)) {
          return true;
        }
        if (product.tags.some((tag) => tag.toLowerCase().includes(query))) {
          return true;
        }
        if (product.category?.toLowerCase().includes(query)) {
          return true;
        }
        return false;
      });
    }

    // sorting ->
    switch (selectedSort) {
      case "a-z":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "z-a":
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "price-low-high":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high-low":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating-high-low":
        result.sort((a, b) => b.rating - a.rating);
        break;
    }

    // Apply price filters -->
    if (filters.minPrice) {
      const min = parseFloat(filters.minPrice);
      result = result.filter((product) => product.price >= min);
    }

    if (filters.maxPrice) {
      const max = parseFloat(filters.maxPrice);
      result = result.filter((product) => product.price <= max);
    }

    // Apply rating filter -->
    if (filters.minRating) {
      const minRating = parseFloat(filters.minRating);
      result = result.filter((product) => product.rating >= minRating);
    }

    // Apply tag filters -->
    if (filters.tags.length > 0) {
      result = result.filter((product) =>
        product.tags.some((tag) => filters.tags.includes(tag))
      );
    }

    return result;
  }, [products, selectedSort, filters, searchQuery]);

  // pagination -->
  const totalPages = Math.ceil(filteredProducts.length / ITEM_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEM_PER_PAGE;
    const end = start + ITEM_PER_PAGE;
    return filteredProducts.slice(start, end);
  }, [filteredProducts, currentPage]);

  // Get all unique tags for filter options
  const allTags = Array.from(
    new Set(products.flatMap((product) => product.tags))
  );

  // Handle tag toggle
  const toggleTag = (tag: string) => {
    setFilters((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  // Clear all filters
  const clearFilters = () => {
    console.log("clicked");
    setFilters({
      minPrice: "",
      maxPrice: "",
      minRating: "",
      tags: [],
    });
    setSelectedSort("a-z");
    setSearchQuery("");
  };

  // Reset to page 1 when filters, sort, or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedSort, filters, searchQuery]);

  // Get sort option display text
  const getSortDisplayText = (option: SortOption) => {
    const options = {
      "a-z": "A-Z",
      "z-a": "Z-A",
      "price-low-high": "Price: Low to High",
      "price-high-low": "Price: High to Low",
      "rating-high-low": "Rating: High to Low",
    };
    return options[option];
  };

  // Sort options configuration
  const sortOptions: {
    value: SortOption;
    icon: React.ReactNode;
    label: string;
  }[] = [
    { value: "a-z", icon: <ArrowUpAZ size={16} />, label: "A-Z" },
    { value: "z-a", icon: <ArrowDownZA size={16} />, label: "Z-A" },
    {
      value: "price-low-high",
      icon: <span>$↑</span>,
      label: "Price: Low to High",
    },
    {
      value: "price-high-low",
      icon: <span>$↓</span>,
      label: "Price: High to Low",
    },
    {
      value: "rating-high-low",
      icon: <Star size={16} />,
      label: "Rating: High to Low",
    },
  ];

  // discount & total price
  const getDiscountedPrice = (price: number, discount: number) => {
    return price - price * (discount / 100);
  };

  return (
    <div className=" mx-auto px-4 py-8">
      {searchQuery && (
        <div className="mb-4 p-3 bg-[#181818] rounded-lg border border-orange-500/20">
          <p>
            Searching for:{" "}
            <span className="font-medium text-orange-500">
              "{searchQuery}"
              <button
                onClick={() => setSearchQuery("")}
                className="ml-2 text-sm text-gray-400 hover:text-white"
              >
                ✕ Clear
              </button>
            </span>
          </p>
        </div>
      )}

      {/* Header and Filter Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mt-8 pb-5 border-b border-white/10 gap-4">
        <h1 className="text-2xl font-bold">
          {searchQuery ? "Search Results" : "All Products"}{" "}
        </h1>
        <div className="flex items-center gap-4 relative">
          {/* Sort Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="text-base font-sans px-4 py-2 rounded-md bg-[#f4f4f4] text-neutral-900 flex items-center gap-2 hover:bg-gray-200 transition-colors"
            >
              <ArrowUpAZ size={18} />
              Sort by: {getSortDisplayText(selectedSort)}
              <ChevronDown
                size={16}
                className={`transition-transform ${
                  isSortOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isSortOpen && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setSelectedSort(option.value);
                      setIsSortOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors ${
                      selectedSort === option.value
                        ? "bg-gray-50 text-orange-600"
                        : "text-gray-700"
                    }`}
                  >
                    <span className="text-gray-500">{option.icon}</span>
                    <span>{option.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Filter Button */}
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="text-base font-sans px-4 py-2 rounded-md bg-[#f4f4f4] text-neutral-900 flex items-center gap-2 hover:bg-gray-200 transition-colors"
          >
            <SlidersHorizontal size={18} />
            Filter
            {Object.values(filters).some((filter) =>
              Array.isArray(filter) ? filter.length > 0 : filter !== ""
            ) && (
              <span className="ml-1 w-2 h-2 bg-orange-500 rounded-full"></span>
            )}
          </button>

          {/* Clear Filters Button */}
          {Object.values(filters).some((filter) =>
            Array.isArray(filter) ? filter.length > 0 : filter !== ""
          ) && (
            <button
              onClick={clearFilters}
              className="text-sm px-3 py-1 text-orange-500 hover:text-orange-600 transition-colors"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Filter Panel */}
      <AnimatePresence>
        {isFilterOpen && (
          <motion.div
            key="filters"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.35,
              ease: "easeInOut",
            }}
            className="mt-6 p-6 bg-[#181818] rounded-xl border border-white/10"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Price Range */}
              <div>
                <h3 className="text-lg font-medium mb-3">Price Range</h3>
                <div className="flex gap-3">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">
                      Min Price
                    </label>
                    <input
                      type="number"
                      value={filters.minPrice}
                      onChange={(e) =>
                        setFilters({ ...filters, minPrice: e.target.value })
                      }
                      placeholder="0"
                      className="w-full px-3 py-2 bg-[#222] rounded-md border border-white/10 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">
                      Max Price
                    </label>
                    <input
                      type="number"
                      value={filters.maxPrice}
                      onChange={(e) =>
                        setFilters({ ...filters, maxPrice: e.target.value })
                      }
                      placeholder="1000"
                      className="w-full px-3 py-2 bg-[#222] rounded-md border border-white/10 text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Rating Filter */}
              <div>
                <h3 className="text-lg font-medium mb-3">Minimum Rating</h3>
                <select
                  value={filters.minRating}
                  onChange={(e) =>
                    setFilters({ ...filters, minRating: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-[#222] rounded-md border border-white/10 text-white"
                >
                  <option value="">Any rating</option>
                  <option value="1">1+ stars</option>
                  <option value="2">2+ stars</option>
                  <option value="3">3+ stars</option>
                  <option value="4">4+ stars</option>
                  <option value="5">5 stars</option>
                </select>
              </div>

              {/* Tags Filter */}
              <div>
                <h3 className="text-lg font-medium mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-1">
                  {allTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        filters.tags.includes(tag)
                          ? "bg-orange-500 text-white"
                          : "bg-[#222] text-gray-300 hover:bg-[#333]"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Count */}
      <div className="mt-6 text-gray-400">
        {searchQuery ? (
          <p>
            Found {filteredProducts.length} product
            {filteredProducts.length !== 1 ? "s" : ""} matching "{searchQuery}"
          </p>
        ) : (
          <p>
            Showing {filteredProducts.length} of {products.length} products
          </p>
        )}
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      ) : (
        /* Product Cards Grid */
        <motion.div className="flex flex-wrap gap-5 justify-center mt-8">
          <AnimatePresence>
            {paginatedProducts.length > 0 ? (
              paginatedProducts.map((product) => (
                <motion.div
                  initial={{ opacity: 0, filter: "blur(10px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, filter: "blur(8px)" }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  key={product.id}
                  className="will-change-[opacity,filter] bg-[#181818] p-4 rounded-xl w-sm flex flex-col border border-white/5 hover:border-white/10 transition-all hover:scale-[1.02]"
                >
                  <div className="w-full sm:h-54 h-44 rounded-lg relative bg-neutral-800">
                    <img
                      src={product.thumbnail}
                      alt={product.title}
                      className="w-full h-full object-contain rounded-lg"
                    />
                    <p
                      className={`px-2 py-1 text-xs rounded-lg inline-block absolute top-0 left-0 ${
                        product.stock > 50
                          ? "bg-green-500/20 text-green-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      } `}
                    >
                      Stock: {product.stock}
                    </p>
                  </div>
                  <div className="flex flex-col mt-5 gap-1 grow">
                    <h1 className="text-lg font-medium line-clamp-1">
                      {product.title}
                    </h1>
                    <span className="flex items-center gap-2 -mt-1">
                      <p className="text-sm text-gray-400">
                        {product.tags.join(", ")}
                      </p>
                    </span>
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex flex-col gap-1">
                        <span className="text-lg font-semibold text-white">
                          $
                          {getDiscountedPrice(
                            product.price,
                            product.discountPercentage
                          ).toFixed(2)}
                        </span>

                        {product.discountPercentage > 0 && (
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-400 line-through">
                              ${product.price.toFixed(2)}
                            </span>
                            <span className="text-xs text-green-400">
                              Save {product.discountPercentage}%
                            </span>
                          </div>
                        )}
                      </div>
                      <span className="flex items-center gap-1">
                        <Star
                          size={14}
                          className="text-orange-400"
                          fill="orange"
                        />
                        <p>{product.rating.toFixed(1)}</p>
                      </span>
                    </div>
                    <Link
                      href={`/products/${product.id}`}
                      className="block w-full"
                    >
                      <button className="sm:py-2 py-1 text-sm mt-5 w-full bg-orange-500 text-white font-medium rounded-md hover:bg-orange-600 transition-colors cursor-pointer">
                        View Product
                      </button>
                    </Link>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0, filter: "blur(10px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                transition={{ duration: 0.3, ease: "easeIn" }}
                className="text-center py-16"
              >
                <h3 className="text-xl font-medium mb-2">No products found</h3>
                <p className="text-gray-400">Try adjusting your filters</p>
                <button
                  onClick={clearFilters}
                  className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
                >
                  Clear all filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default ProductPage;
