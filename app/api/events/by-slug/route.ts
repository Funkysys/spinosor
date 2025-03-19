import prisma from "@/lib/connect";
import { EventWithArtists } from "@/types";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const { searchParams } = req.nextUrl;
  const slug = searchParams.get("slug");
  try {
    if (!slug && slug !== "" && typeof slug !== "string") {
      throw new Error("L'identifiant de l'événement est requis.");
    }

    const event = await prisma.event.findUnique({
      where: { slug },
      include: {
        artists: true,
      },
    });

    if (!event) {
      throw new Error(`Aucun événement trouvé avec l'identifiant : ${slug}`);
    }

    return NextResponse.json(event as EventWithArtists, {
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
};
