import prisma from "@/lib/connect";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const params = req.nextUrl.searchParams;
  const email = params.get("email");
  try {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== "string" || !emailRegex.test(email)) {
      throw new Error("Invalid email address");
    }
    const user = await prisma.user.findUnique({
      where: { email },
    });
    return NextResponse.json(user, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error while fetching user: ", error);
    return NextResponse.json(
      { error: "Error while fetching user" },
      { status: 500 }
    );
  }
};
