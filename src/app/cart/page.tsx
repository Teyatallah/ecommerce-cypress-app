"use client";

import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { items, removeFromCart, itemsCount } = useCart();
  const router = useRouter();
  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (itemsCount === 0) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-rose-900 mb-4">
          Your Cart is Empty
        </h2>
        <p className="text-rose-700 mb-8">
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
      <h1 className="text-2xl font-bold text-rose-900 mb-8">Shopping Cart</h1>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm"
          >
            <div className="relative w-20 h-20">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover rounded"
              />
            </div>

            <div className="flex-1">
              <h3 className="font-semibold text-rose-900">{item.name}</h3>
              <p className="text-rose-600">Quantity: {item.quantity}</p>
              <p className="text-rose-800">${item.price.toFixed(2)}</p>
            </div>

            <button
              onClick={() => removeFromCart(item.id)}
              className="text-rose-500 hover:text-rose-700"
            >
              Remove
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
