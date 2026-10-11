import { NextResponse } from "next/server";
import { createOrder, listOrders } from "@/lib/orders-store";

export async function GET() {
  const orders = await listOrders();
  return NextResponse.json({ orders });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      itemId?: string;
      quantity?: number;
      name?: string;
      desk?: string;
      readyBy?: string;
      readyByLabel?: string;
      notes?: string;
    };

    const order = await createOrder({
      itemId: body.itemId ?? "",
      quantity: Number(body.quantity ?? 1),
      name: body.name ?? "",
      desk: body.desk ?? "",
      readyBy: body.readyBy ?? "",
      readyByLabel: body.readyByLabel ?? "",
      notes: body.notes ?? "",
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not place that order.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
