"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useState } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";

export default function CartPage() {
  const router = useRouter();
  const { items, removeFromCart, updateQuantity } = useCart();
  const [updating, setUpdating] = useState<number | null>(null);

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleQuantityChange = async (
    productId: number,
    newQuantity: number
  ) => {
    if (newQuantity < 1) return;
    setUpdating(productId);
    try {
      await updateQuantity(productId, newQuantity);
    } finally {
      setUpdating(null);
    }
  };

  const handleEmptyCart = () => {
    items.forEach((item) => removeFromCart(item.id));
  };

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center">
        <h2 className="text-2xl font-bold text-rose-900 mb-4">
          Your Cart is Empty
        </h2>
        <p className="text-rose-600 mb-8">
          Start shopping to add items to your cart.
        </p>
        <button
          onClick={() => router.push("/products")}
          className="bg-rose-500 text-white px-6 py-3 rounded-lg hover:bg-rose-600 transition"
        >
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-rose-900">Shopping Cart</h1>
        <button
          onClick={handleEmptyCart}
          className="text-rose-500 hover:text-rose-700 transition-colors flex items-center gap-2 px-3 py-2 rounded-lg border border-rose-200 hover:border-rose-300"
        >
          <Trash2 className="w-4 h-4" />
          Empty Cart
        </button>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm"
          >
            <div className="relative w-20 h-20">
              <Image
                src={`/earings/${(item.id % 5) + 1}.png`}
                alt={item.name}
                fill
                className="object-cover rounded"
              />
            </div>

            <div className="flex-1">
              <h3 className="font-semibold text-rose-900">{item.name}</h3>
              <p className="text-rose-600">${item.price.toFixed(2)}</p>
            </div>

            <div className="flex items-center gap-2 text-black">
              <button
                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                disabled={updating === item.id}
                className="p-1 rounded-full hover:bg-rose-100"
                data-testid="decrease-quantity"
              >
                <Minus className="w-4 h-4" />
              </button>

              <span className="w-12 text-center">{item.quantity}</span>

              <button
                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                disabled={updating === item.id}
                className="p-1 rounded-full hover:bg-rose-100"
                data-testid="increase-quantity"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => removeFromCart(item.id)}
              className="p-2 text-rose-500 hover:text-rose-700 transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-between text-lg font-semibold text-rose-900 mb-4">
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>

        <button
          onClick={() => router.push("/checkout")}
          className="w-full bg-rose-500 text-white py-3 rounded-lg hover:bg-rose-600 transition"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
