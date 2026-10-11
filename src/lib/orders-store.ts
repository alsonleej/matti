import { promises as fs } from "fs";
import path from "path";
import { getMenuItem } from "@/data/menu";
import type { Order, OrderStatus, PlaceOrderInput } from "@/lib/types";
import { ORDER_STATUSES } from "@/lib/types";

const DATA_DIR = path.join(process.cwd(), "data");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");

let writeChain: Promise<unknown> = Promise.resolve();

function withLock<T>(fn: () => Promise<T>): Promise<T> {
  const run = writeChain.then(fn, fn);
  writeChain = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

async function readOrdersFromDisk(): Promise<Order[]> {
  try {
    const raw = await fs.readFile(ORDERS_FILE, "utf8");
    const parsed = JSON.parse(raw) as Order[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeOrdersToDisk(orders: Order[]) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(ORDERS_FILE, `${JSON.stringify(orders, null, 2)}\n`, "utf8");
}

function makeOrderId() {
  const nibble = crypto.randomUUID().replace(/-/g, "").slice(0, 4).toUpperCase();
  return `HC-${nibble}`;
}

export async function listOrders() {
  const orders = await readOrdersFromDisk();
  return [...orders].sort(
    (a, b) => new Date(a.readyBy).getTime() - new Date(b.readyBy).getTime(),
  );
}

export async function getOrder(id: string) {
  const orders = await readOrdersFromDisk();
  return orders.find((order) => order.id === id) ?? null;
}

export async function createOrder(input: PlaceOrderInput) {
  const item = getMenuItem(input.itemId);
  if (!item) {
    throw new Error("That item is not on the menu.");
  }

  const name = input.name.trim();
  const desk = input.desk.trim();
  if (!name) throw new Error("Add your name so we know who to call.");
  if (!desk) throw new Error("Add a desk, floor, or Slack handle.");
  if (!input.readyBy || !input.readyByLabel) {
    throw new Error("Pick a ready-by time.");
  }

  const quantity = Math.min(3, Math.max(1, Math.round(input.quantity)));
  const readyAt = new Date(input.readyBy);
  if (Number.isNaN(readyAt.getTime())) {
    throw new Error("That ready-by time is not valid.");
  }

  const order: Order = {
    id: makeOrderId(),
    itemId: item.id,
    itemName: item.name,
    itemImage: item.image,
    priceCents: item.priceCents * quantity,
    quantity,
    name,
    desk,
    readyBy: readyAt.toISOString(),
    readyByLabel: input.readyByLabel.trim(),
    notes: input.notes.trim().slice(0, 280),
    status: "queued",
    createdAt: new Date().toISOString(),
  };

  return withLock(async () => {
    const orders = await readOrdersFromDisk();
    orders.push(order);
    await writeOrdersToDisk(orders);
    return order;
  });
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  if (!ORDER_STATUSES.includes(status)) {
    throw new Error("Unknown order status.");
  }

  return withLock(async () => {
    const orders = await readOrdersFromDisk();
    const index = orders.findIndex((order) => order.id === id);
    if (index === -1) return null;

    const updated = { ...orders[index], status };
    orders[index] = updated;
    await writeOrdersToDisk(orders);
    return updated;
  });
}
