import { getMenuItem } from "@/data/menu";
import { getPerson, personHasItem } from "@/data/people";
import type { Order, OrderStatus, PlaceOrderInput } from "@/lib/types";

const STORAGE_KEY = "matti.orders.v1";
const REMOTE_URL = process.env.NEXT_PUBLIC_ORDERS_URL ?? "";

export const hasRemoteOrders = Boolean(REMOTE_URL);

function readLocal(): Order[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(parsed) ? (parsed as Order[]) : [];
  } catch {
    return [];
  }
}

function writeLocal(orders: Order[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}

function upsertLocal(order: Order) {
  const orders = readLocal().filter((entry) => entry.id !== order.id);
  orders.push(order);
  writeLocal(orders);
}

// text/plain keeps the request "simple" so Apps Script doesn't need a CORS preflight.
async function postRemote(body: unknown) {
  const response = await fetch(REMOTE_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error("The order sheet didn’t accept that.");
  const payload = (await response.json()) as { ok?: boolean; error?: string };
  if (payload.ok === false) throw new Error(payload.error ?? "The order sheet didn’t accept that.");
}

function sortOrders(orders: Order[]) {
  return [...orders].sort((a, b) => {
    if (a.kind !== b.kind) return a.kind === "heat" ? -1 : 1;
    const aTime = a.kind === "heat" ? a.readyBy : a.createdAt;
    const bTime = b.kind === "heat" ? b.readyBy : b.createdAt;
    return new Date(aTime).getTime() - new Date(bTime).getTime();
  });
}

function makeOrderId() {
  const nibble = crypto.randomUUID().replace(/-/g, "").slice(0, 4).toUpperCase();
  return `MT-${nibble}`;
}

export function buildOrder(input: PlaceOrderInput): Order {
  const person = getPerson(input.personId);
  if (!person) throw new Error("Unknown menu.");

  const kind = input.kind === "stock" ? "stock" : "heat";
  const item = getMenuItem(input.itemId);
  if (!item || !personHasItem(person, item.id, kind)) {
    throw new Error("That item is not on this menu.");
  }

  const name = input.name.trim();
  const desk = input.desk.trim();
  if (!name) throw new Error("Add your name so we know who to call.");
  if (!desk) throw new Error("Add a desk, floor, or Slack handle.");

  let readyBy = "";
  let readyByLabel = "";
  if (kind === "heat") {
    const readyAt = new Date(input.readyBy ?? "");
    if (!input.readyByLabel || Number.isNaN(readyAt.getTime())) {
      throw new Error("Pick a ready-by time.");
    }
    readyBy = readyAt.toISOString();
    readyByLabel = input.readyByLabel.trim();
  }

  const quantity = Math.min(3, Math.max(1, Math.round(input.quantity)));

  return {
    id: makeOrderId(),
    kind,
    personId: person.id,
    itemId: item.id,
    itemName: item.name,
    itemImage: item.image,
    priceKr: item.priceKr * quantity,
    quantity,
    name,
    desk,
    readyBy,
    readyByLabel,
    status: kind === "heat" ? "queued" : "requested",
    createdAt: new Date().toISOString(),
  };
}

export async function placeOrder(input: PlaceOrderInput) {
  const order = buildOrder(input);
  if (hasRemoteOrders) {
    await postRemote({ action: "create", order });
  }
  upsertLocal(order);
  return order;
}

export async function listOrders(): Promise<Order[]> {
  if (!hasRemoteOrders) return sortOrders(readLocal());

  const response = await fetch(REMOTE_URL, { cache: "no-store" });
  if (!response.ok) throw new Error("Couldn’t reach the order sheet.");
  const payload = (await response.json()) as { orders?: Order[] };
  return sortOrders(payload.orders ?? []);
}

export function getLocalOrder(id: string) {
  return readLocal().find((order) => order.id === id) ?? null;
}

export async function updateOrderStatus(order: Order, status: OrderStatus) {
  if (order.kind !== "heat") {
    throw new Error("Stock requests don’t move through the microwave queue.");
  }
  const updated: Order = { ...order, status };
  if (hasRemoteOrders) {
    await postRemote({ action: "status", id: order.id, status });
  }
  upsertLocal(updated);
  return updated;
}
