"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Navigation from "./Navigation";

export default function Header() {
  const pathname = usePathname();
  const isHome =
    pathname === "/" ||
    pathname === "/auth/login" ||
    pathname === "/auth/register" ||
    pathname === "/auth/reset-password" ||
    pathname === "/auth/confirm-reset-password";

  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        // Cuộn xuống
        setShowHeader(false);
      } else {
        // Cuộn lên
        setShowHeader(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <header
      className={`
        fixed top-0 left-0 w-full z-[60] transition-all duration-300 
        ${isHome ? "bg-transparent" : "bg-black"}
        ${showHeader ? "translate-y-0" : "-translate-y-full"}
      `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center">
        <Link href="/" className="flex-shrink-0">
          <Image
            src="/images/logo.png"
            alt="Logo"
            width={159}
            height={60}
            className="h-8 sm:h-10 w-auto"
            priority
          />
        </Link>

        <div className="flex-1 flex justify-center px-4 sm:px-6">
          <div className="relative flex-1 max-w-[200px] sm:max-w-[300px] md:max-w-[400px] lg:max-w-[500px]">
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="pl-10 pr-4 py-2 w-full bg-white/80 text-black rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-black"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        <Navigation />
      </div>
    </header>
  );
}
