// src/app/api/checkout/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { items, shippingDetails, paymentMethod, total } =
      await request.json();

    // Create order in database
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        status: "pending",
        items: {
          create: items.map((item: any) => ({
            product: { connect: { id: item.id } },
            quantity: item.quantity,
          })),
        },
      },
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}
