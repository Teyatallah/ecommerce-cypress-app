// src/app/checkout/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import PaymentMethodSection from "@/components/checkout/PaymentMethodSection";
import ShippingForm from "@/components/checkout/ShippingForm";
import OrderSummary from "@/components/checkout/OrderSummary";

export type PaymentMethod = "card" | "paypal" | "cod";

export interface FormData {
  name: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  paymentMethod: PaymentMethod;
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
}

export interface FormErrors {
  name?: string;
  email?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart } = useCart();
  const { user, isLoading } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
    country: "France",
    paymentMethod: "card",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login?redirect=/checkout");
    }
  }, [user, isLoading, router]);

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      router.push("/cart");
    }
  }, [items, router]);

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case "name":
        if (!value) return "Name is required";
        if (value.length > 50) return "Name must be less than 50 characters";
        if (value.length < 2) return "Name is too short";
        break;
      case "email":
        if (!value) return "Email is required";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value))
          return "Please enter a valid email address";
        break;
      case "address":
        if (!value) return "Address is required";
        if (value.length > 100)
          return "Address must be less than 100 characters";
        if (value.length < 5) return "Address is too short";
        break;
      case "city":
        if (!value) return "City is required";
        if (value.length > 50) return "City must be less than 50 characters";
        if (value.length < 2) return "City name is too short";
        break;
      case "postalCode":
        if (!value) return "Postal code is required";
        const postalCodeRegex = /^\d{5}$/;
        if (!postalCodeRegex.test(value))
          return "Postal code must be exactly 5 numbers";
        break;
      case "cardNumber":
        if (formData.paymentMethod === "card") {
          if (!value) return "Card number is required";
          const cardNumberRegex = /^\d{16}$/;
          if (!cardNumberRegex.test(value))
            return "Card number must be 16 digits";
        }
        break;
      case "expiryDate":
        if (formData.paymentMethod === "card") {
          if (!value) return "Expiry date is required";
          const expiryRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
          if (!expiryRegex.test(value))
            return "Expiry date must be in MM/YY format";
          else {
            // Check if card is expired
            const [month, year] = value.split("/");
            const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1);
            if (expiry < new Date()) return "Card has expired";
          }
        }
        break;
      case "cvv":
        if (formData.paymentMethod === "card") {
          if (!value) return "CVV is required";
          const cvvRegex = /^\d{3}$/;
          if (!cvvRegex.test(value)) return "CVV must be 3 digits";
        }
        break;
    }
    return "";
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Format card number
    if (name === "cardNumber") {
      const formatted = value.replace(/\D/g, "").slice(0, 16);
      setFormData((prev) => ({ ...prev, cardNumber: formatted }));
    }
    // Format expiry date
    else if (name === "expiryDate") {
      let formatted = value.replace(/\D/g, "");
      if (formatted.length >= 2) {
        formatted = formatted.slice(0, 2) + "/" + formatted.slice(2, 4);
      }
      setFormData((prev) => ({ ...prev, expiryDate: formatted }));
    }
    // Format CVV
    else if (name === "cvv") {
      const formatted = value.replace(/\D/g, "").slice(0, 3);
      setFormData((prev) => ({ ...prev, cvv: formatted }));
    }
    // Handle other fields normally
    else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    const error = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    // Always validate shipping fields
    ["name", "email", "address", "city", "postalCode"].forEach((field) => {
      const error = validateField(
        field,
        formData[field as keyof FormData] || ""
      );
      if (error) {
        newErrors[field as keyof FormErrors] = error;
        isValid = false;
      }
    });

    // Validate card fields only if card payment is selected
    if (formData.paymentMethod === "card") {
      ["cardNumber", "expiryDate", "cvv"].forEach((field) => {
        const error = validateField(
          field,
          formData[field as keyof FormData] || ""
        );
        if (error) {
          newErrors[field as keyof FormErrors] = error;
          isValid = false;
        }
      });
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      const firstError = document.querySelector(".text-red-500");
      if (firstError) {
        firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      }
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
          paymentMethod: formData.paymentMethod,
          total,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Checkout failed");
      }

      // Store the orderId before clearing cart
      const orderId = data.orderId;

      // Disable the cart empty redirect temporarily
      const ignoreCartEmpty = true;

      // Clear cart
      clearCart();

      // Using router.push with a slight delay to ensure state updates complete
      setTimeout(() => {
        router.push(`/checkout/confirmation?orderId=${orderId}`);
      }, 1);
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Checkout failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Modify the cart empty check to not redirect during checkout
  useEffect(() => {
    if (items.length === 0 && !isProcessing) {
      router.push("/cart");
    }
  }, [items, router, isProcessing]);

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (isLoading || !user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-bold text-rose-900 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <ShippingForm
              formData={formData}
              errors={errors}
              onChange={handleInputChange}
            />

            <PaymentMethodSection
              formData={formData}
              errors={errors}
              onChange={handleInputChange}
            />

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

        <OrderSummary items={items} total={total} />
      </div>
    </div>
  );
}
