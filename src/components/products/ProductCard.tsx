// src/components/products/ProductCard.tsx
"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import toast from "react-hot-toast";

interface Product {
  id: number;
  name: string;
  price: number;
  category: {
    name: string;
  };
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);

  const imageNumber = (product.id % 5) + 1;
  const imagePath = `/earings/${imageNumber}.png`;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLoading(true);

    try {
      addToCart(product);
      toast.success(`${product.name} added to cart!`, {
        className: "custom-toast",
        style: {
          background: "#f43f5e",
          color: "#fff",
        },
        iconTheme: {
          primary: "#fff",
          secondary: "#f43f5e",
        },
      });
    } catch (error) {
      toast.error("Failed to add to cart");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden cursor-pointer"
      onClick={() => router.push(`/products/${product.id}`)}
    >
      <div className="relative aspect-square bg-gray-50">
        <Image
          src={imagePath}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-200"
        />
      </div>

      <div className="p-4">
        <div className="mb-2">
          <p className="text-sm text-rose-500 mb-1">{product.category.name}</p>
          <h3 className="font-semibold text-gray-900">{product.name}</h3>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-rose-700">
            ${product.price.toFixed(2)}
          </span>

          <button
            onClick={handleAddToCart}
            disabled={isLoading}
            className={`px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Adding..." : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
