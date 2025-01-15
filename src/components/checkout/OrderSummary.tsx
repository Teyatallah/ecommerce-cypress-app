interface OrderSummaryProps {
  items: Array<{
    id: number;
    name: string;
    price: number;
    quantity: number;
  }>;
  total: number;
}

export default function OrderSummary({ items, total }: OrderSummaryProps) {
  return (
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
  );
}
