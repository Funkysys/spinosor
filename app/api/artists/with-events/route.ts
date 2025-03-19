import prisma from "@/lib/connect";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const artists = await prisma.artist.findMany({
      include: {
        events: true,
      },
    });

    const transformedArtists = artists.map((artist) => ({
      ...artist,
      events: artist.events.map((event) => ({
        ...event,
        date: event.date.toISOString(),
        createdAt: event.createdAt.toISOString(),
        updatedAt: event.updatedAt.toISOString(),
      })),
    }));
    return NextResponse.json(transformedArtists);
  } catch (error) {
    console.error("Erreur lors de la récupération des artistes :", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des artistes" },
      { status: 500 }
    );
  }
};
