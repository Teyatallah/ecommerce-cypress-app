"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

const europeanCountries = [
  "France",
  "Germany",
  "Italy",
  "Spain",
  "Belgium",
  "Netherlands",
  "Portugal",
  "Greece",
  "Sweden",
  "Denmark",
  "Finland",
  "Ireland",
  "Austria",
  "Poland",
  "Czech Republic",
  "Slovakia",
  "Hungary",
];

interface FormErrors {
  name?: string;
  email?: string;
  address?: string;
  city?: string;
  postalCode?: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart } = useCart();
  const { user, isLoading } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
    country: "France",
  });

  // Only redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login?redirect=/checkout");
    }
  }, [user, isLoading, router]);

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case "name":
        if (value.length > 50) return "Name must be less than 50 characters";
        if (value.length < 2) return "Name is too short";
        break;
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value))
          return "Please enter a valid email address";
        break;
      case "address":
        if (value.length > 100)
          return "Address must be less than 100 characters";
        if (value.length < 5) return "Address is too short";
        break;
      case "city":
        if (value.length > 50) return "City must be less than 50 characters";
        if (value.length < 2) return "City name is too short";
        break;
      case "postalCode":
        const postalCodeRegex = /^\d{5}$/;
        if (!postalCodeRegex.test(value))
          return "Postal code must be exactly 5 numbers";
        break;
    }
    return "";
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    const error = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    Object.keys(formData).forEach((key) => {
      if (key !== "country") {
        const error = validateField(
          key,
          formData[key as keyof typeof formData]
        );
        if (error) {
          newErrors[key as keyof FormErrors] = error;
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items,
          shippingDetails: formData,
          total,
        }),
      });

      if (!response.ok) {
        throw new Error("Checkout failed");
      }

      const { orderId } = await response.json();

      // Clear cart first
      clearCart();

      // Use replace instead of push to prevent back navigation
      router.replace(`/checkout/confirmation?orderId=${orderId}`);
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Checkout failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading || !user) {
    return <div>Loading...</div>;
  }

  // Remove the cart empty check here
  // Let the useEffect handle the redirection

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-bold text-rose-900 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold text-rose-800 mb-4">
            Shipping Details
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-rose-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-gray-600 border border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                placeholder="Enter your full name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-rose-700 mb-1">
                Email
              </label>
              <input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-gray-600 border border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                placeholder="your@email.com"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-rose-700 mb-1">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-gray-600 border border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                placeholder="Enter your street address"
              />
              {errors.address && (
                <p className="text-red-500 text-sm mt-1">{errors.address}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-rose-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-gray-600 border border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  placeholder="Enter city"
                />
                {errors.city && (
                  <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-rose-700 mb-1">
                  Postal Code
                </label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-gray-600 border border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  placeholder="12345"
                />
                {errors.postalCode && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.postalCode}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-rose-700 mb-1">
                Country
              </label>
              <select
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-gray-600 border border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                {europeanCountries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className={`w-full bg-rose-500 text-white py-3 rounded-lg hover:bg-rose-600 transition ${
                isProcessing ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isProcessing ? "Processing..." : `Pay ${total.toFixed(2)} $`}
            </button>
          </form>
        </div>

        {/* Order Summary - remains the same */}
        <div>
          <h2 className="text-xl font-semibold text-rose-800 mb-4">
            Order Summary
          </h2>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between py-2 border-b border-rose-100"
              >
                <span className="text-rose-700">
                  {item.name} x {item.quantity}
                </span>
                <span className="text-rose-900 font-medium">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
            <div className="flex justify-between pt-4 font-bold">
              <span className="text-rose-800">Total</span>
              <span className="text-rose-900">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
