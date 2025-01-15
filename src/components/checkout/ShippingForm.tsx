import { FormData, FormErrors } from "@/app/checkout/page";

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

interface ShippingFormProps {
  formData: FormData;
  errors: FormErrors;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
}

export default function ShippingForm({
  formData,
  errors,
  onChange,
}: ShippingFormProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-rose-800 mb-4">
        Shipping Details
      </h2>

      <div>
        <label className="block text-sm font-medium text-rose-700 mb-1">
          Full Name
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={onChange}
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
          onChange={onChange}
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
          onChange={onChange}
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
            onChange={onChange}
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
            onChange={onChange}
            className="w-full px-3 py-2 text-gray-600 border border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
            placeholder="12345"
          />
          {errors.postalCode && (
            <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>
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
          onChange={onChange}
          className="w-full px-3 py-2 text-gray-600 border border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
        >
          {europeanCountries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
