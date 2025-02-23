"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black bg-opacity-50 backdrop-blur-md">
      <nav className="container mx-auto px-4 py-4">
        <ul className="flex justify-center space-x-8 relative">
          {[
            { href: "/", label: "Home" },
            { href: "/demo", label: "Demo" },
            { href: "/team", label: "Team" },
          ].map((link) => (
            <li key={link.href} className="relative">
              <Link
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "text-white"
                    : "text-gray-400 hover:text-gray-300"
                }`}
              >
                {link.label}
              </Link>
              {pathname === link.href && (
                <motion.div
                  layoutId="bubble"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-white rounded-full"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
