"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

interface NavbarProps {
  logo: string;
  logoText: string;
  dashboardPath: string;
  links: {
    path: string;
    text: string;
  }[];
}

const Navbar: React.FC<NavbarProps> = ({ logo, logoText, dashboardPath, links }) => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-10 bg-white shadow-md w-full">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex justify-between items-center py-4">
          <Link href={dashboardPath} className="flex items-center">
            <Image src={logo} alt={logoText} width={20} height={20} className="w-8 h-8 mr-2" />
            <span className="text-lg font-bold">{logoText}</span>
          </Link>
          <button className="md:hidden text-gray-600" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Toggle menu">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <ul
            className={`absolute md:relative top-full left-0 w-full md:w-auto
            bg-white md:bg-transparent shadow-md md:shadow-none
            ${isMobileMenuOpen ? "block" : "hidden"} 
            md:flex md:items-center md:space-x-4 p-4 md:p-0`}
          >
            {links.map((link, index) => (
              <li key={index} className="text-center md:text-left py-2 md:py-0">
                <Link
                  href={link.path}
                  className={`block text-lg ${pathname === link.path ? "text-red-500" : "text-gray-600"} 
                    hover:text-red-500 transition duration-200`}
                >
                  {link.text}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
