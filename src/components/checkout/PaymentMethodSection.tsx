// src/components/checkout/PaymentMethodSection.tsx
"use client";

import { FormData, FormErrors } from "@/app/checkout/page";

interface PaymentMethodSectionProps {
  formData: FormData;
  errors: FormErrors;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
}

export default function PaymentMethodSection({
  formData,
  errors,
  onChange,
}: PaymentMethodSectionProps) {
  // Format card number as user types (add spaces)
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    value = value.slice(0, 16);

    // Create modified event
    const newEvent = {
      ...e,
      target: {
        ...e.target,
        name: "cardNumber",
        value: value,
      },
    };

    onChange(newEvent);
  };

  // Format expiry date as user types
  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");

    if (value.length >= 2) {
      value = value.slice(0, 2) + "/" + value.slice(2, 4);
    }

    const newEvent = {
      ...e,
      target: {
        ...e.target,
        name: "expiryDate",
        value: value.slice(0, 5),
      },
    };

    onChange(newEvent);
  };

  // Format CVV as user types
  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "").slice(0, 3);

    const newEvent = {
      ...e,
      target: {
        ...e.target,
        name: "cvv",
        value,
      },
    };

    onChange(newEvent);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-rose-800">Payment Method</h2>

      <div className="space-y-3 text-gray-600">
        {/* Credit Card */}
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="radio"
            name="paymentMethod"
            value="card"
            checked={formData.paymentMethod === "card"}
            onChange={onChange}
            className="text-rose-500 focus:ring-rose-500 cursor-pointer"
          />
          <span className="select-none">Credit Card</span>
        </label>

        {formData.paymentMethod === "card" && (
          <div className="ml-7 space-y-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-rose-700 mb-1">
                Card Number
              </label>
              <input
                type="text"
                name="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={formData.cardNumber || ""}
                onChange={handleCardNumberChange}
                className="w-full px-3 py-2 text-gray-600 border border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                maxLength={16}
                autoComplete="cc-number"
              />
              {errors.cardNumber && (
                <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-rose-700 mb-1">
                  Expiry Date
                </label>
                <input
                  type="text"
                  name="expiryDate"
                  placeholder="MM/YY"
                  value={formData.expiryDate || ""}
                  onChange={handleExpiryDateChange}
                  className="w-full px-3 py-2 text-gray-600 border border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  maxLength={5}
                  autoComplete="cc-exp"
                />
                {errors.expiryDate && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.expiryDate}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-rose-700 mb-1">
                  CVV
                </label>
                <input
                  type="text"
                  name="cvv"
                  placeholder="123"
                  value={formData.cvv || ""}
                  onChange={handleCvvChange}
                  className="w-full px-3 py-2 text-gray-600 border border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  maxLength={3}
                  autoComplete="cc-csc"
                />
                {errors.cvv && (
                  <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>
                )}
              </div>
            </div>

            <div className="text-sm text-gray-500 mt-2">
              <p>• Card number should be 16 digits</p>
              <p>• Expiry date format: MM/YY</p>
              <p>• CVV is the 3-digit security code on the back of your card</p>
            </div>
          </div>
        )}

        {/* PayPal */}
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="radio"
            name="paymentMethod"
            value="paypal"
            checked={formData.paymentMethod === "paypal"}
            onChange={onChange}
            className="text-rose-500 focus:ring-rose-500 cursor-pointer"
          />
          <span className="select-none">PayPal</span>
        </label>

        {formData.paymentMethod === "paypal" && (
          <div className="ml-7 p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-600">
              You will be redirected to PayPal to complete your payment
              securely.
            </p>
          </div>
        )}

        {/* Cash on Delivery */}
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="radio"
            name="paymentMethod"
            value="cod"
            checked={formData.paymentMethod === "cod"}
            onChange={onChange}
            className="text-rose-500 focus:ring-rose-500 cursor-pointer"
          />
          <span className="select-none">Cash on Delivery</span>
        </label>

        {formData.paymentMethod === "cod" && (
          <div className="ml-7 p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-600">
              Pay with cash when your order is delivered. Additional fee may
              apply.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
