// src/app/products/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ProductCard from "@/components/products/ProductCard";
import { ChevronUp, ChevronDown } from "lucide-react";

interface Product {
  id: number;
  name: string;
  price: number;
  category: {
    name: string;
  };
}

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sortBy = searchParams.get("sortBy") || "name";
  const sortOrder = searchParams.get("sortOrder") || "asc";

  useEffect(() => {
    async function fetchProducts() {
      setIsLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({
          sortBy,
          sortOrder,
        });

        const res = await fetch(`/api/products?${params}`);
        if (!res.ok) throw new Error("Failed to fetch products");

        const data = await res.json();

        // Verify that data is an array
        if (!Array.isArray(data)) {
          throw new Error("Invalid data format");
        }

        setProducts(data);
      } catch (error) {
        console.error("Error:", error);
        setError("Failed to load products");
      } finally {
        setIsLoading(false);
      }
    }

    fetchProducts();
  }, [sortBy, sortOrder]);

  const updateSort = (newSortBy: string) => {
    const newSortOrder =
      sortBy === newSortBy && sortOrder === "asc" ? "desc" : "asc";

    const params = new URLSearchParams({
      sortBy: newSortBy,
      sortOrder: newSortOrder,
    });

    router.push(`/products?${params}`);
  };

  return (
    <div className="max-w-7xl mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-rose-900">Our Collection</h1>

        <div className="flex gap-4">
          <button
            onClick={() => updateSort("name")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
              sortBy === "name"
                ? "bg-rose-100 text-rose-900"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Name
            {sortBy === "name" &&
              (sortOrder === "asc" ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              ))}
          </button>

          <button
            onClick={() => updateSort("price")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
              sortBy === "price"
                ? "bg-rose-100 text-rose-900"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Price
            {sortBy === "price" &&
              (sortOrder === "asc" ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              ))}
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="text-rose-600">Loading...</div>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <div className="text-red-500">{error}</div>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-rose-600">No products found</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
