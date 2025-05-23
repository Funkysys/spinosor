import prisma from "@/lib/connect";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const albums = await prisma.album.findMany({
      include: { artist: true },
    });

    return NextResponse.json(albums);
  } catch (error) {
    console.error("Error fetching all albums:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
