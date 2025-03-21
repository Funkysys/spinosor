import prisma from "@/lib/connect";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" }, // Optionnel: trier par date de création
    });

    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
    }

    return NextResponse.json(messages);
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la récupération des messages" },
      { status: 500 }
    );
  }
};
