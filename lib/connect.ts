import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient;

declare global {
  // Ajoute cela pour éviter la duplication de Prisma dans l'environnement de développement
  var prisma: PrismaClient | undefined;
}

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export default prisma;
