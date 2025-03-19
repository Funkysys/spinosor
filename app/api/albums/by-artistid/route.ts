import prisma from "@/lib/connect";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const artistId = searchParams.get("artistId");

  if (!artistId) {
    return NextResponse.json(
      { error: "Artist ID is required" },
      { status: 400 }
    );
  }

  try {
    const albums = await prisma.album.findMany({
      where: { artistId },
    });

    return NextResponse.json(albums);
  } catch (error) {
    console.error("Error getting the albums by artist ID:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
