"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { ShoppingCart } from "lucide-react";

export default function Header() {
  const { itemsCount } = useCart();
  const { user, logout } = useAuth();

  return (
    <header className="bg-rose-100 shadow-sm">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-rose-800">
            Elegant Earrings
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/products"
              className="text-rose-700 hover:text-rose-900"
            >
              Products
            </Link>
            <Link
              href="/cart"
              className="text-rose-700 hover:text-rose-900 relative group"
            >
              <div className="flex items-center gap-1">
                <ShoppingCart className="w-6 h-6 group-hover:text-rose-900" />
                {itemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {itemsCount}
                  </span>
                )}
              </div>
            </Link>
            {user ? (
              <div className="flex items-center gap-4">
                <Link
                  href="/profile"
                  className="text-rose-700 hover:text-rose-900 transition-colors duration-200"
                >
                  {user.email}
                </Link>
                <button
                  onClick={logout}
                  className="bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 transition"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
