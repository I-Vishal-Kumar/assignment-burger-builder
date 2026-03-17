import { useState } from "react";
import toast from "react-hot-toast";
import { type SliceType, SLICE_PRICES, API_URL } from "../types";
import BurgerVisualization from "./BurgerVisualization";

interface Props {
  slices: SliceType[];
  quantity: number;
  totalPrice: number;
  onBack: () => void;
  onOrderPlaced: () => void;
}

type PaymentMethod = "UPI" | "Cash" | "COD" | "Net Banking";

function Checkout({ slices, quantity, totalPrice, onBack, onOrderPlaced }: Props) {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [payment, setPayment] = useState<PaymentMethod>("UPI");
  const [submitting, setSubmitting] = useState(false);

  const validateForm = () => {
    if (!name.trim()) {
      toast.error("Please enter your name");
      return false;
    }
    if (!/^\d{10}$/.test(mobile)) {
      toast.error("Please enter a valid 10-digit mobile number");
      return false;
    }
    if (!address.trim()) {
      toast.error("Please enter your address");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: name.trim(),
          mobile,
          address: address.trim(),
          paymentMethod: payment,
          slices,
          quantity,
          totalPrice,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || "Failed to place order");
      }

      toast.success("Order placed successfully!");
      onOrderPlaced();
    } catch (err) {
      toast.error(err instanceof Error ? err.message :  "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const paymentOptions: PaymentMethod[] = ["UPI", "Cash", "COD", "Net Banking"];

  return (
    <div className="max-w-2xl mx-auto mt-4">
      <button
        onClick={onBack}
        className="text-amber-700 hover:text-amber-900 mb-4 font-medium"
      >
        &larr; Back to Builder
      </button>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-xl font-semibold">Delivery Details</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Customer Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mobile Number
            </label>
            <input
              type="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
              placeholder="10 digit number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
              placeholder="Delivery address"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Method
            </label>
            <div className="flex flex-wrap gap-3">
              {paymentOptions.map((opt) => (
                <label
                  key={opt}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border cursor-pointer text-sm ${
                    payment === opt
                      ? "border-amber-500 bg-amber-50"
                      : "border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={opt}
                    checked={payment === opt}
                    onChange={() => setPayment(opt)}
                    className="accent-amber-600"
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
          >
            {submitting ? "Placing Order..." : "Place Order"}
          </button>
        </form>

        {/* Cart summary */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4 h-fit">
          <h2 className="text-xl font-semibold">Order Summary</h2>

          <div className="flex justify-center">
            <BurgerVisualization slices={slices} mini />
          </div>

          <div className="text-sm space-y-1">
            <p className="font-medium">Fillings:</p>
            <ul className="ml-4 list-disc text-gray-600">
              {slices.map((s, i) => (
                <li key={i} className="capitalize">
                  {s} — ₹{SLICE_PRICES[s]}
                </li>
              ))}
            </ul>
          </div>

          <div className="text-sm space-y-1 border-t pt-2">
            <div className="flex justify-between">
              <span>Quantity</span>
              <span>{quantity}</span>
            </div>
            <div className="flex justify-between font-bold text-base">
              <span>Total</span>
              <span>₹{totalPrice}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
