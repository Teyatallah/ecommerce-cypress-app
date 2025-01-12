// src/app/products/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { use } from "react";

interface Product {
  id: number;
  name: string;
  price: number;
  category: {
    name: string;
  };
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetail({ params }: PageProps) {
  // Unwrap params using React.use()
  const resolvedParams = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useCart();
  const router = useRouter();

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${resolvedParams.id}`);
        if (!res.ok) throw new Error("Product not found");
        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.error("Failed to fetch product:", error);
        router.push("/products");
      } finally {
        setIsLoading(false);
      }
    }

    fetchProduct();
  }, [resolvedParams.id, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-rose-600">Loading...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-rose-600">Product not found</div>
      </div>
    );
  }

  const imagePath = `/earings/${(product.id % 5) + 1}.png`;

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative aspect-square">
          <Image
            src={imagePath}
            alt={product.name}
            fill
            className="object-cover rounded-lg"
          />
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-rose-500 mb-2">{product.category.name}</p>
            <h1 className="text-3xl font-bold text-rose-900">{product.name}</h1>
            <p className="text-2xl font-bold text-rose-700 mt-2">
              ${product.price.toFixed(2)}
            </p>
          </div>

          <div className="prose text-rose-600">
            <p>
              Beautiful handcrafted earrings that will make you stand out.
              Perfect for any occasion, these earrings combine elegance with
              modern design.
            </p>
          </div>

          <button
            onClick={() => {
              addToCart(product);
              router.push("/cart");
            }}
            className="w-full bg-rose-500 text-white py-3 rounded-lg hover:bg-rose-600 transition"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
