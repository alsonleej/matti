import { NextResponse } from "next/server";
import { getOrder, updateOrderStatus } from "@/lib/orders-store";
import { ORDER_STATUSES, type OrderStatus } from "@/lib/types";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const order = await getOrder(id);

  if (!order) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  return NextResponse.json({ order });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const body = (await request.json()) as { status?: string };
    const status = body.status as OrderStatus | undefined;

    if (!status || !ORDER_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: "Send a valid status." },
        { status: 400 },
      );
    }

    const order = await updateOrderStatus(id, status);
    if (!order) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not update that order.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
