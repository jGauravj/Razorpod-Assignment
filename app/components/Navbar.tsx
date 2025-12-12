import { Search } from "lucide-react";
import Image from "next/image";

const Navbar = () => {
  const navItems = ["New", "Store", "Products", "Contact"];

  return (
    <nav className="w-full border-b border-white/5">
      <div className="max-w-7xl mx-auto flex items-center justify-between py-3 ">
        <Image src="/logo.svg" alt="logo" width={80} height={80} className="" />
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
        <div className="relative w-full max-w-xs">
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-11 focus:ring-2 border border-white/10 ring-white/10 rounded-lg outline-none px-3 py-2.5 bg-[#111111] transition-all duration-300 ease-in-out font-mono text-sm"
          />

          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
