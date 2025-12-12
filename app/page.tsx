import { ArrowUpAZ, SlidersHorizontal } from "lucide-react";
import React from "react";
import ProductCard from "./components/ProductCard";

const page = () => {
  return (
    <div className="w-full min-h-screen">
      <div className="mx-auto max-w-7xl h-screen">
        <div className="flex items-center justify-between mt-8 pb-5 border-b border-white/10">
          <h1 className="text-2xl ">All Products</h1>
          <div className="flex items-center gap-4 ">
            <button className="text-base font-sans px-3 py-1 rounded-md bg-[#f4f4f4] text-neutral-900 flex items-center gap-1">
              <ArrowUpAZ size={18} />
              Sort by
            </button>
            <button className="text-base font-sans px-3 py-1 rounded-md bg-[#f4f4f4] text-neutral-900 flex items-center gap-1">
              <SlidersHorizontal size={18} />
              Filter
            </button>
          </div>
        </div>
        <ProductCard />
      </div>
    </div>
  );
};

export default page;
