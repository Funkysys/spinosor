import prisma from "@/lib/connect";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" }, // Optionnel: trier par date de création
    });

    return NextResponse.json(messages);
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la récupération des messages" },
      { status: 500 }
    );
  }
};
