"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
      <p className="text-gray-400 mb-8">
        {error.message || "Failed to load product details"}
      </p>
      <div className="flex gap-4 justify-center">
        <button
          onClick={() => reset()}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          Try again
        </button>
        <Link
          href="/"
          className="px-4 py-2 border border-white/10 rounded-lg hover:bg-white/5 transition-colors"
        >
          Back to Products
        </Link>
      </div>
    </div>
  );
}
