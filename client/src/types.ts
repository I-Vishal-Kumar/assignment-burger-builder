export type SliceType = "aloo-tikki" | "paneer" | "cheese" | "tomato" | "onion" | "lettuce";

export const SLICE_PRICES: Record<SliceType, number> = {
  "aloo-tikki": 20,
  paneer: 25,
  cheese: 15,
  tomato: 10,
  onion: 10,
  lettuce: 8,
};

export const SLICE_COLORS: Record<SliceType, string> = {
  "aloo-tikki": "bg-amber-700",
  paneer: "bg-yellow-200",
  cheese: "bg-yellow-400",
  tomato: "bg-red-500",
  onion: "bg-purple-300",
  lettuce: "bg-green-400",
};

export const PLATFORM_FEE = 5;
