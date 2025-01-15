// src/app/products/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ProductCard from "@/components/products/ProductCard";
import { ChevronUp, ChevronDown } from "lucide-react";

interface Category {
  id: number;
  name: string;
}

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const sortBy = searchParams.get("sortBy") || "name";
  const sortOrder = searchParams.get("sortOrder") || "asc";
  const categoryId = searchParams.get("categoryId");

  useEffect(() => {
    // Fetch categories
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }, []);

  useEffect(() => {
    async function fetchProducts() {
      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          sortBy,
          sortOrder,
          ...(categoryId && { categoryId }),
        });

        const res = await fetch(`/api/products?${params}`);
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProducts();
  }, [sortBy, sortOrder, categoryId]);

  const updateSort = (newSortBy: string) => {
    const newSortOrder =
      sortBy === newSortBy && sortOrder === "asc" ? "desc" : "asc";

    const params = new URLSearchParams(searchParams);
    params.set("sortBy", newSortBy);
    params.set("sortOrder", newSortOrder);

    router.push(`/products?${params.toString()}`);
  };

  const updateCategory = (newCategoryId: string) => {
    const params = new URLSearchParams(searchParams);
    if (newCategoryId === "all") {
      params.delete("categoryId");
    } else {
      params.set("categoryId", newCategoryId);
    }
    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="max-w-7xl mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-rose-900">Our Collection</h1>

        <div className="flex gap-4 items-center">
          {/* Category Filter */}
          <select
            value={categoryId || "all"}
            onChange={(e) => updateCategory(e.target.value)}
            className="px-4 py-2 rounded-lg border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-500 text-gray-600"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          {/* Sort Buttons */}
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
        <div className="text-center py-12">Loading...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-rose-600">No products found</p>
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
