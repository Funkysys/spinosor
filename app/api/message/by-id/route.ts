import prisma from "@/lib/connect";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const { searchParams } = req.nextUrl;
  const id = searchParams.get("id");
  if (!id && id === "" && typeof id !== "string") {
    try {
      const message = await prisma.contactMessage.findUnique({
        where: { id },
      });
      return NextResponse.json(message, {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  }
};
