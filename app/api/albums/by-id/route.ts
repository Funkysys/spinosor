import prisma from "@/lib/connect";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const params = new URL(request.url).searchParams;
  const id = params.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Album ID is required" },
      { status: 400 }
    );
  }

  try {
    const album = await prisma.album.findUnique({
      where: { id },
      include: { artist: true },
    });

    if (!album) {
      return NextResponse.json({ error: "Album not found" }, { status: 404 });
    }

    return NextResponse.json(album);
  } catch (error) {
    console.error("Error getting the album:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
