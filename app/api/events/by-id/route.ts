import prisma from "@/lib/connect";
import { EventWithArtists } from "@/types";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const { searchParams } = req.nextUrl;
  const id = searchParams.get("id");
  try {
    if (!id && id !== "" && typeof id !== "string") {
      throw new Error("L'identifiant de l'événement est requis.");
    }

    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        artists: true,
      },
    });

    if (!event) {
      throw new Error(`Aucun événement trouvé avec l'identifiant : ${id}`);
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
