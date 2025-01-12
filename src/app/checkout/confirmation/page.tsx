"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function ConfirmationPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <div className="max-w-2xl mx-auto py-16 text-center">
      <div className="bg-white p-8 rounded-lg shadow-sm">
        <div className="flex justify-center mb-6">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        <h1 className="text-3xl font-bold text-rose-900 mb-4">
          Thank You for Your Order!
        </h1>
        <p className="text-rose-700 mb-6">
          Order #{orderId} has been successfully placed.
        </p>
        <p className="text-rose-600 mb-8">
          We'll send you an email confirmation with order details and tracking
          information.
        </p>
        <Link
          href="/products"
          className="bg-rose-500 text-white px-6 py-3 rounded-lg hover:bg-rose-600 transition inline-block"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
