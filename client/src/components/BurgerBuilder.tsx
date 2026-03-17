import { useMemo } from "react";
import {type SliceType, SLICE_PRICES, PLATFORM_FEE, SLICE_COLORS } from "../types";
import BurgerVisualization from "./BurgerVisualization";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";

const ALL_SLICES: SliceType[] = [
  "aloo-tikki",
  "paneer",
  "cheese",
  "tomato",
  "onion",
  "lettuce",
];

interface Props {
  slices: SliceType[];
  setSlices: React.Dispatch<React.SetStateAction<SliceType[]>>;
  quantity: number;
  setQuantity: React.Dispatch<React.SetStateAction<number>>;
  onCheckout: () => void;
}

function BurgerBuilder({ slices, setSlices, quantity, setQuantity, onCheckout }: Props) {
  const totalSlices = slices.length + 2; // +2 for bread

  const addSlice = (type: SliceType) => {
    if (slices.length >= 8) return;
    setSlices((prev) => [...prev, type]);
  };

  const removeSlice = (index: number) => {
    setSlices((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const updated = [...slices];
    const [moved] = updated.splice(result.source.index, 1);
    updated.splice(result.destination.index, 0, moved);
    setSlices(updated);
  };

  // price calc
  const basePrice =  useMemo(() => slices.reduce((sum, s) => sum + SLICE_PRICES[s], 0), [slices]) ;

  const {discount , extraCharge} = useMemo( () => {
    let discount = 0;
    let extraCharge = 0;
    if (slices.includes("cheese") && slices.includes("paneer")) {
      discount = 3;
    }
    for (let i = 0; i < slices.length - 1; i++) {
      if (slices[i] === "aloo-tikki" && slices[i + 1] === "aloo-tikki") {
        extraCharge += 2;
      }
    }
    return { discount, extraCharge };
  }, [slices]) 
  
  const perBurger = basePrice - discount + extraCharge;
  const totalPrice = perBurger * quantity + PLATFORM_FEE;

  return (
    <div className="flex flex-col md:flex-row gap-6 mt-4 md:h-[calc(100vh-6rem)]">
      {/* Left - controls */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Add Fillings - fixed top section */}
        <div className="shrink-0 pb-4">
          <h2 className="text-lg font-semibold mb-3">Add Fillings</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {ALL_SLICES.map((type) => (
              <button
                key={type}
                onClick={() => addSlice(type)}
                disabled={slices.length >= 8}
                className={`px-3 py-2 rounded-lg text-sm font-medium border border-gray-300 hover:shadow-md transition disabled:opacity-40 disabled:cursor-not-allowed ${SLICE_COLORS[type]} ${
                  type === "tomato" ? "text-white" : "text-gray-800"
                } ${type === "aloo-tikki" ? "text-white" : ""}`}
              >
                {type} - ₹{SLICE_PRICES[type]}
              </button>
            ))}
          </div>
          {slices.length >= 8 && (
            <p className="text-red-500 text-sm mt-2">Max 8 fillings reached!</p>
          )}
        </div>

        {/* Your Fillings - scrollable middle section */}
        {slices.length > 0 && (
          <div className="flex-1 min-h-0 pb-4 flex flex-col">
            <h2 className="text-lg font-semibold mb-2 shrink-0">Your Fillings</h2>
            <p className="text-xs text-gray-500 mb-2 shrink-0">Drag to reorder</p>
            <div className="flex-1 overflow-y-auto min-h-0">
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="fillings">
                  {(provided) => (
                    <ul
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="space-y-1 pr-1"
                    >
                      {slices.map((slice, idx) => (
                        <Draggable key={`${slice}-${idx}`} draggableId={`${slice}-${idx}`} index={idx}>
                          {(provided, snapshot) => (
                            <li
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`flex items-center justify-between px-3 py-2 rounded ${
                                snapshot.isDragging ? "shadow-lg" : ""
                              } bg-white border border-gray-200`}
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-gray-400 cursor-grab">⠿</span>
                                <span
                                  className={`w-4 h-4 rounded-full inline-block ${SLICE_COLORS[slice]}`}
                                />
                                <span className="text-sm capitalize">{slice}</span>
                              </div>
                              <button
                                onClick={() => removeSlice(idx)}
                                className="text-red-400 hover:text-red-600 text-sm font-bold"
                              >
                                x
                              </button>
                            </li>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </ul>
                  )}
                </Droppable>
              </DragDropContext>
            </div>
          </div>
        )}

        {/* Billing section - fixed bottom */}
        <div className="shrink-0 space-y-4 pt-2 border-t border-gray-200">
          {/* Quantity */}
          <div className="flex items-center gap-3">
            <span className="font-medium">Quantity:</span>
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-8 h-8 rounded bg-gray-200 hover:bg-gray-300 font-bold"
            >
              -
            </button>
            <span className="text-lg font-semibold w-6 text-center">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => Math.min(10, q + 1))}
              className="w-8 h-8 rounded bg-gray-200 hover:bg-gray-300 font-bold"
            >
              +
            </button>
          </div>

          {/* Price breakdown */}
          <div className="bg-white rounded-lg p-4 border border-gray-200 text-sm space-y-1">
            <h3 className="font-semibold text-base mb-2">Price Breakdown</h3>
            {slices.length === 0 ? (
              <p className="text-gray-400">Add some fillings to see the price</p>
            ) : (
              <>
                <div className="flex justify-between">
                  <span>Fillings total</span>
                  <span>₹{basePrice}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Cheese + Paneer combo discount</span>
                    <span>-₹{discount}</span>
                  </div>
                )}
                {extraCharge > 0 && (
                  <div className="flex justify-between text-orange-600">
                    <span>Consecutive aloo-tikki surcharge</span>
                    <span>+₹{extraCharge}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Per burger</span>
                  <span>₹{perBurger}</span>
                </div>
                <div className="flex justify-between">
                  <span>x {quantity}</span>
                  <span>₹{perBurger * quantity}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Platform fee</span>
                  <span>₹{PLATFORM_FEE}</span>
                </div>
                <hr className="my-1" />
                <div className="flex justify-between font-bold text-base">
                  <span>Total</span>
                  <span>₹{totalPrice}</span>
                </div>
              </>
            )}
          </div>

          {totalSlices > 6 && slices.length > 0 && (
            <div className="bg-yellow-100 border border-yellow-400 rounded-lg px-4 py-3 text-sm text-yellow-800">
              Chef suggests splitting this burger into two burgers!
            </div>
          )}

          <button
            onClick={onCheckout}
            disabled={slices.length === 0}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>

      {/* Right - burger visualization */}
      <div className="flex-1 flex justify-center items-start sticky top-8">
        <BurgerVisualization slices={slices} />
      </div>
    </div>
  );
}

export default BurgerBuilder;
