import { useState } from "react";
import { Toaster } from "react-hot-toast";
import type { SliceType } from "./types";
import { SLICE_PRICES, PLATFORM_FEE } from "./types";
import BurgerBuilder from "./components/BurgerBuilder";
import Checkout from "./components/Checkout";
import OrdersModal from "./components/OrdersModal";

function calculateTotal(slices: SliceType[], quantity: number) {
  let base = slices.reduce((sum, s) => sum + SLICE_PRICES[s], 0);

  const hasCheese = slices.includes("cheese");
  const hasPaneer = slices.includes("paneer");
  if (hasCheese && hasPaneer) base -= 3;

  for (let i = 0; i < slices.length - 1; i++) {
    if (slices[i] === "aloo-tikki" && slices[i + 1] === "aloo-tikki") {
      base += 2;
    }
  }

  return base * quantity + PLATFORM_FEE;
}

function App() {
  const [slices, setSlices] = useState<SliceType[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showOrders, setShowOrders] = useState(false);

  const totalPrice = calculateTotal(slices, quantity);

  const handleReset = () => {
    setSlices([]);
    setQuantity(1);
    setShowCheckout(false);
  };

  return (
    <div className="min-h-screen bg-orange-50">
      <Toaster position="top-right" />
      <header className="bg-amber-600 text-white py-4 px-6 shadow-md flex items-center justify-between">
        <h1 className="text-2xl font-bold">Burger Builder</h1>
        <button
          onClick={() => setShowOrders(true)}
          className="bg-amber-700 hover:bg-amber-800 px-4 py-2 rounded-lg text-sm font-medium transition"
        >
          My Orders
        </button>
      </header>

      {showOrders && <OrdersModal onClose={() => setShowOrders(false)} />}

      <main className="max-w-6xl mx-auto p-4">
        {!showCheckout ? (
          <BurgerBuilder
            slices={slices}
            setSlices={setSlices}
            quantity={quantity}
            setQuantity={setQuantity}
            onCheckout={() => setShowCheckout(true)}
          />
        ) : (
          <Checkout
            slices={slices}
            quantity={quantity}
            totalPrice={totalPrice}
            onBack={() => setShowCheckout(false)}
            onOrderPlaced={handleReset}
          />
        )}
      </main>
    </div>
  );
}

export default App;
