import prisma from "@/lib/connect";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const banners = await prisma.banner.findMany();
    return NextResponse.json(banners);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch banners" },
      { status: 500 }
    );
  }
};
