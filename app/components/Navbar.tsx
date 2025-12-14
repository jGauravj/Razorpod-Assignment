"use client";

import { useSearch } from "@/context/SearchContext";
import { Menu, Search, X } from "lucide-react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";

const Navbar = () => {
  const navItems = ["New", "Store", "Products", "Contact"];
  const { searchQuery, setSearchQuery } = useSearch();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearchOpen(false);
  };

  return (
    <motion.nav
      initial={{ opacity: 0, filter: "blur(10px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="sticky top-0 z-30 w-full border-b border-white/5 bg-neutral-900/80 backdrop-blur"
    >
      {/*  TOP BAR -> */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <Image src="/logo.svg" alt="logo" width={80} height={80} />
        </Link>

        {/* Desktop Nav -> */}
        <ul className="hidden md:flex items-center gap-6 text-sm font-mono">
          {navItems.map((item) => (
            <li
              key={item}
              className="cursor-pointer text-neutral-200 hover:text-orange-500 transition"
            >
              {item}
            </li>
          ))}
        </ul>

        {/* Desktop Search -> */}
        <form onSubmit={handleSubmit} className="relative hidden md:block w-64">
          <input
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search products..."
            className="w-full pl-10 pr-3 py-2 rounded-lg bg-[#111] border border-white/10 outline-none text-sm"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
        </form>

        {/* Mobile Buttons */}
        <div className="md:hidden flex items-center gap-3">
          <button
            onClick={() => {
              setIsSearchOpen((p) => !p);
              setIsMenuOpen(false);
            }}
          >
            <Search size={20} />
          </button>

          <button
            onClick={() => {
              setIsMenuOpen((p) => !p);
              setIsSearchOpen(false);
            }}
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/*  MOBILE SEARCH ->   */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden overflow-hidden px-4"
          >
            <form onSubmit={handleSubmit} className="relative py-3">
              <input
                autoFocus
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search products..."
                className="w-full pl-10 pr-3 py-2 rounded-lg bg-[#111] border border-white/10"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu -> */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="md:hidden overflow-hidden px-6 pb-4 flex flex-col gap-4"
          >
            {navItems.map((item) => (
              <li
                key={item}
                onClick={() => setIsMenuOpen(false)}
                className="py-2 border-b border-white/10 text-neutral-200 hover:text-orange-500"
              >
                {item}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
