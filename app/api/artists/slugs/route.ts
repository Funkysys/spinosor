import prisma from "@/lib/connect";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const artists = await prisma.artist.findMany({
      select: {
        slug: true,
      },
    });
    return NextResponse.json(artists);
  } catch (error) {
    console.error("Erreur lors de la récupération des artistes :", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des artistes" },
      { status: 500 }
    );
  }
};
