export const ORDER_STATUSES = [
  "queued",
  "heating",
  "ready",
  "picked_up",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export type Order = {
  id: string;
  itemId: string;
  itemName: string;
  itemImage: string;
  priceCents: number;
  quantity: number;
  name: string;
  desk: string;
  readyBy: string;
  readyByLabel: string;
  notes: string;
  status: OrderStatus;
  createdAt: string;
};

export type PlaceOrderInput = {
  itemId: string;
  quantity: number;
  name: string;
  desk: string;
  readyBy: string;
  readyByLabel: string;
  notes: string;
};
