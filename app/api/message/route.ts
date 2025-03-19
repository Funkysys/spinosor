import prisma from "@/lib/connect";

// Récupérer tous les messages
export const GET_MESSAGES = async () => {
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" }, // Optionnel: trier par date de création
    });
    return messages;
  } catch (error) {
    console.error("Erreur lors de la récupération des messages :", error);
    return [];
  }
};

// Récupérer un message par son ID
export const GET_MESSAGE = async (id: string) => {
  if (!id && id === "" && typeof id !== "string") {
    try {
      const message = await prisma.contactMessage.findUnique({
        where: { id },
      });
      return message;
    } catch (error) {
      console.error("Erreur lors de la récupération du message :", error);
      return null;
    }
  } else {
    return null;
  }
};
