"use client";

import { useSearch } from "@/context/SearchContext";
import { Search } from "lucide-react";
import Image from "next/image";
import { motion } from "motion/react";
import Link from "next/link";

const Navbar = () => {
  const navItems = ["New", "Store", "Products", "Contact"];
  const { searchQuery, setSearchQuery } = useSearch();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <motion.nav
      initial={{ opacity: 0, filter: "blur(10px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full border-b border-white/5 sticky top-0 bg-neutral-900/10 backdrop-blur-sm z-20"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between py-3 ">
        <motion.div>
          <Link href="/">
            <Image
              src="/logo.svg"
              alt="logo"
              width={80}
              height={80}
              className=""
            />
          </Link>
        </motion.div>

        <ul className="flex text-sm font-mono items-center gap-5">
          {navItems.map((item, index) => (
            <li
              key={index}
              className="cursor-pointer text-neutral-200 hover:text-orange-600 transition-colors duration-200 ease-in-out"
            >
              {item}
            </li>
          ))}
        </ul>
        <form onSubmit={handleSubmit} className="relative w-full max-w-xs">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search Products..."
            className="w-full pl-11 focus:ring-2 border border-white/10 ring-white/10 rounded-lg outline-none px-3 py-2.5 bg-[#111111] transition-all duration-300 ease-in-out font-mono text-sm"
          />

          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
        </form>
      </div>
    </motion.nav>
  );
};

export default Navbar;
