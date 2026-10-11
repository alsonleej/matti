import type { PersonId } from "@/data/people";

export const ORDER_STATUSES = [
  "queued",
  "heating",
  "ready",
  "picked_up",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export type OrderKind = "heat" | "stock";

export type Order = {
  id: string;
  kind: OrderKind;
  personId: PersonId;
  itemId: string;
  itemName: string;
  itemImage: string;
  priceKr: number;
  quantity: number;
  name: string;
  desk: string;
  readyBy: string;
  readyByLabel: string;
  status: OrderStatus | "requested";
  createdAt: string;
};

export type PlaceOrderInput = {
  kind: OrderKind;
  personId: string;
  itemId: string;
  quantity: number;
  name: string;
  desk: string;
  readyBy?: string;
  readyByLabel?: string;
};
