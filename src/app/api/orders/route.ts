import { NextResponse } from "next/server";
import { createOrder, listOrders } from "@/lib/orders-store";
import type { OrderKind } from "@/lib/types";

export async function GET() {
  const orders = await listOrders();
  return NextResponse.json({ orders });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      kind?: OrderKind;
      personId?: string;
      itemId?: string;
      quantity?: number;
      name?: string;
      desk?: string;
      readyBy?: string;
      readyByLabel?: string;
    };

    const order = await createOrder({
      kind: body.kind === "stock" ? "stock" : "heat",
      personId: body.personId ?? "",
      itemId: body.itemId ?? "",
      quantity: Number(body.quantity ?? 1),
      name: body.name ?? "",
      desk: body.desk ?? "",
      readyBy: body.readyBy,
      readyByLabel: body.readyByLabel,
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not place that order.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
