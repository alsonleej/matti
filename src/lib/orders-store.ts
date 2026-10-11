import { promises as fs } from "fs";
import path from "path";
import { getMenuItem } from "@/data/menu";
import { getPerson, personHasItem } from "@/data/people";
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
  return `MT-${nibble}`;
}

export async function listOrders() {
  const orders = await readOrdersFromDisk();
  return [...orders].sort((a, b) => {
    if (a.kind !== b.kind) return a.kind === "heat" ? -1 : 1;
    const aTime = a.kind === "heat" ? a.readyBy : a.createdAt;
    const bTime = b.kind === "heat" ? b.readyBy : b.createdAt;
    return new Date(aTime).getTime() - new Date(bTime).getTime();
  });
}

export async function getOrder(id: string) {
  const orders = await readOrdersFromDisk();
  return orders.find((order) => order.id === id) ?? null;
}

export async function createOrder(input: PlaceOrderInput) {
  const person = getPerson(input.personId);
  if (!person) {
    throw new Error("Unknown menu.");
  }

  const kind = input.kind === "stock" ? "stock" : "heat";
  const item = getMenuItem(input.itemId);
  if (!item) {
    throw new Error("That item is not on the menu.");
  }
  if (!personHasItem(person, item.id, kind)) {
    throw new Error("That item is not on this menu.");
  }

  const name = input.name.trim();
  const desk = input.desk.trim();
  if (!name) throw new Error("Add your name so we know who to call.");
  if (!desk) throw new Error("Add a desk, floor, or Slack handle.");

  const quantity = Math.min(3, Math.max(1, Math.round(input.quantity)));

  let readyBy = "";
  let readyByLabel = "";
  if (kind === "heat") {
    if (!input.readyBy || !input.readyByLabel) {
      throw new Error("Pick a ready-by time.");
    }
    const readyAt = new Date(input.readyBy);
    if (Number.isNaN(readyAt.getTime())) {
      throw new Error("That ready-by time is not valid.");
    }
    readyBy = readyAt.toISOString();
    readyByLabel = input.readyByLabel.trim();
  }

  const order: Order = {
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
    if (orders[index].kind !== "heat") {
      throw new Error("Stock requests don’t move through the microwave queue.");
    }

    const updated = { ...orders[index], status };
    orders[index] = updated;
    await writeOrdersToDisk(orders);
    return updated;
  });
}
