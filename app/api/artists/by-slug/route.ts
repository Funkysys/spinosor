import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const params = req.nextUrl.searchParams;
  const slug = params.get("slug");

  if (!slug && slug !== "" && typeof slug !== "string") {
    return NextResponse.json(
      { error: "L'slug de l'artiste est requis" },
      { status: 400 }
    );
  }
  try {
    const artist = await prisma.artist.findUnique({
      where: { slug },
      include: {
        events: true,
        albums: true,
      },
    });
    return NextResponse.json(artist);
  } catch (error) {
    console.error("Erreur lors de la récupération de l'artiste :", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération de l'artiste" },
      { status: 500 }
    );
  }
};
