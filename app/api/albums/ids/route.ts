import prisma from "@/lib/connect";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const albums = await prisma.album.findMany({
      select: { id: true },
    });

    const albumIds = albums.map((album) => album.id);
    return NextResponse.json(albumIds);
  } catch (error) {
    console.error("Error getting the albums IDs:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
