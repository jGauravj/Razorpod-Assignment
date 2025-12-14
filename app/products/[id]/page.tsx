"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, notFound } from "next/navigation";
import { Star, ArrowLeft, ShoppingCart, Truck, Shield } from "lucide-react";
import Link from "next/link";
import { api } from "@/app/lib/axios";
import { Product } from "@/app/lib/products";
import Loading from "./loading";
import Error from "@/app/error";
import useSWR from "swr";
import { AnimatePresence, motion } from "motion/react";

const ProductDetailPage = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const { id } = useParams<{ id: string }>();

  // fetching data with swr -->
  const {
    data: product,
    isLoading,
    error,
  } = useSWR<Product>(
    id ? `/products/${id}` : null,
    (url) => api.get<Product>(url).then((res) => res.data),
    {
      revalidateOnFocus: false,
    }
  );

  const discountedPrice = useMemo(() => {
    return product
      ? product.price - product.price * (product.discountPercentage / 100)
      : 0;
  }, [product]);

  const totalPrice = useMemo(() => {
    return discountedPrice * quantity;
  }, [discountedPrice, quantity]);

  if (isLoading) return <Loading />;
  if (error || !product)
    return (
      <Error
        error={error as Error & { digest?: string }}
        reset={() => window.location.reload()}
      />
    );

  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(10px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      transition={{
        duration: 0.45,
        ease: "easeOut",
      }}
      className="max-w-7xl mx-auto px-4 py-8"
    >
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Products
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Images */}
        <div>
          {/* Main Image */}
          <div className="bg-[#181818] rounded-xl p-4 mb-4 overflow-hidden h-96">
            <AnimatePresence mode="wait">
              <motion.img
                key={product.images?.[selectedImage] || product.thumbnail}
                src={product.images?.[selectedImage] || product.thumbnail}
                alt={product.title}
                initial={{
                  opacity: 0,
                  filter: "blur(10px)",
                  scale: 0.98,
                }}
                animate={{
                  opacity: 1,
                  filter: "blur(0px)",
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  filter: "blur(12px)",
                  scale: 1.02,
                }}
                transition={{
                  duration: 0.35,
                  ease: "easeInOut",
                }}
                className="w-full h-full object-contain rounded-lg"
              />
            </AnimatePresence>
          </div>

          {/* Thumbnail Gallery */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    selectedImage === index
                      ? "border-orange-500"
                      : "border-transparent"
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.title} - ${index + 1}`}
                    className="w-full h-full object-cover "
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column - Product Info */}
        <div>
          {/* Brand and Category */}
          <div className="mb-4">
            <span className="text-sm text-gray-400">
              {product.brand} • {product.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold mb-4">{product.title}</h1>

          {/* Rating and Stock */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-1">
              <Star size={18} className="text-orange-400" fill="orange" />
              <span>{product.rating.toFixed(1)}</span>
              <span className="text-gray-400 ml-2">
                ({product.reviews?.length || 0} reviews)
              </span>
            </div>
            <div
              className={`px-2 py-1 text-xs rounded ${
                product.stock > 50
                  ? "bg-green-500/20 text-green-400"
                  : "bg-yellow-500/20 text-yellow-400"
              }`}
            >
              {product.stock > 50 ? "In Stock" : "Low Stock"} ({product.stock})
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-gray-300 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Tags */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-[#222] text-gray-300 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Price Section */}
          <div className="mb-8 p-6 bg-[#181818] rounded-xl border border-white/10">
            <div className="flex items-center gap-4 mb-4">
              <div className="sm:text-4xl text-xl font-bold">
                ${discountedPrice.toFixed(2)}
              </div>
              {product.discountPercentage > 0 && (
                <>
                  <div className="sm:text-xl text-sm text-gray-400 line-through">
                    ${product.price.toFixed(2)}
                  </div>
                  <div className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full sm:text-sm text-xs">
                    Save {product.discountPercentage}%
                  </div>
                </>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="mb-6">
              <label className="block text-sm text-gray-400 mb-2">
                Quantity
              </label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-white/10 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 bg-[#222] hover:bg-[#333] transition-colors"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 w-16 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 bg-[#222] hover:bg-[#333] transition-colors"
                  >
                    +
                  </button>
                </div>
                <div className="text-lg">
                  Total:{" "}
                  <span className="font-bold">${totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="sm:flex sm:flex-row sm:gap-4 flex flex-col gap-3  ">
              <button className="flex-1 sm:py-3  sm:text-base text-sm py-2 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center gap-2">
                <ShoppingCart size={20} />
                Add to Cart
              </button>
              <button className="flex-1  sm:py-3 sm:text-base text-sm py-2 bg-transparent border border-orange-500 text-orange-500 font-medium rounded-lg hover:bg-orange-500/10 transition-colors">
                Buy Now
              </button>
            </div>
          </div>

          {/* Product Details */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="p-4 bg-[#181818] rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Truck size={18} className="text-gray-400" />
                <h3 className="font-medium">Shipping</h3>
              </div>
              <p className="text-sm text-gray-400">
                {product.shippingInformation}
              </p>
            </div>
            <div className="p-4 bg-[#181818] rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Shield size={18} className="text-gray-400" />
                <h3 className="font-medium">Warranty</h3>
              </div>
              <p className="text-sm text-gray-400">
                {product.warrantyInformation}
              </p>
            </div>
          </div>

          {/* Additional Info */}
          <div className="space-y-4">
            {product.dimensions && (
              <div>
                <h3 className="font-medium mb-1">Dimensions</h3>
                <p className="text-sm text-gray-400">
                  {product.dimensions.width} × {product.dimensions.height} ×{" "}
                  {product.dimensions.depth} cm
                </p>
              </div>
            )}
            {product.weight && (
              <div>
                <h3 className="font-medium mb-1">Weight</h3>
                <p className="text-sm text-gray-400">{product.weight} kg</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      {product.reviews && product.reviews.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
          <div className="space-y-4">
            {product.reviews.map((review, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.4,
                  ease: "easeOut",
                }}
                key={index}
                className="bg-[#181818] p-6 rounded-xl border border-white/5"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-medium">{review.reviewerName}</h4>
                    <p className="text-sm text-gray-400">
                      {review.reviewerEmail}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star size={16} className="text-orange-400" fill="orange" />
                    <span>{review.rating}</span>
                  </div>
                </div>
                <p className="text-gray-300">{review.comment}</p>
                <p className="text-sm text-gray-400 mt-2">
                  {new Date(review.date).toLocaleDateString()}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ProductDetailPage;
