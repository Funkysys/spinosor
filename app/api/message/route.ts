import prisma from "@/lib/connect";
import { NextResponse } from "next/server";

// Récupérer tous les messages
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

// export const GET_MESSAGE = async (id: string) => {
//   if (!id && id === "" && typeof id !== "string") {
//     try {
//       const message = await prisma.contactMessage.findUnique({
//         where: { id },
//       });
//       return message;
//     } catch (error) {
//       console.error("Erreur lors de la récupération du message :", error);
//       return null;
//     }
//   } else {
//     return null;
//   }
// };
