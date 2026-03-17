import { useEffect, useState } from "react";

interface Order {
  _id: string;
  customerName: string;
  mobile: string;
  address: string;
  paymentMethod: string;
  slices: string[];
  quantity: number;
  totalPrice: number;
  createdAt: string;
}

interface Props {
  onClose: () => void;
}

function OrdersModal({ onClose }: Props) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/orders")
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-xl font-semibold">Past Orders</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <p className="text-gray-400 text-center py-8">Loading...</p>
          ) : orders.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No orders yet</p>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="border border-gray-200 rounded-lg p-4 text-sm space-y-2"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-base">{order.customerName}</p>
                      <p className="text-gray-500">{order.mobile}</p>
                    </div>
                    <span className="text-lg font-bold text-amber-700">
                      ₹{order.totalPrice}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {order.slices.map((s, i) => (
                      <span
                        key={i}
                        className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-xs capitalize"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                  <div className="flex justify-between text-gray-500 text-xs">
                    <span>Qty: {order.quantity} · {order.paymentMethod}</span>
                    <span>{new Date(order.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="text-gray-500 text-xs">{order.address}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default OrdersModal;
