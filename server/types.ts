export type SliceType = "aloo-tikki" | "paneer" | "cheese" | "tomato" | "onion" | "lettuce";

export interface Slice {
  type: SliceType;
  price: number;
}

export const SLICE_PRICES: Record<SliceType, number> = {
  "aloo-tikki": 20,
  paneer: 25,
  cheese: 15,
  tomato: 10,
  onion: 10,
  lettuce: 8,
};

export interface Order {
  customerName: string;
  mobile: string;
  address: string;
  paymentMethod: "upi" | "cash" | "cod" | "netbanking";
  slices: SliceType[];
  quantity: number;
  totalPrice: number;
  createdAt: Date;
}

export const PLATFORM_FEE = 5;
