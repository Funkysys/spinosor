import prisma from "@/lib/connect";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const events = await prisma.event.findMany({
      select: {
        id: true,
        title: true,
      },
    });
    return NextResponse.json(events, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};
