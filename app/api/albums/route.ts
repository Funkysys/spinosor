import prisma from "@/lib/connect";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

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
export async function GET_ALL() {
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

export async function GET_ALBUMS_BY_ARTIST(request: Request) {
  const { searchParams } = new URL(request.url);
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

export async function GET_ALBUM_IDS() {
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
