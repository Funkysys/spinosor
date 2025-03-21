import prisma from "@/lib/connect";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth, { NextAuthOptions } from "next-auth"; // Importer les types NextAuth
import type { Adapter } from "next-auth/adapters";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  debug: false,
  adapter: PrismaAdapter(prisma) as Adapter,
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
  ],
  callbacks: {
    session({ session, token, user }) {
      if (!token || !user) {
        console.error("Token or user is missing.");
        return session; // Retourne la session sans la modifier si des données sont manquantes
      }
      return {
        ...session,
        user: {
          ...session.user,
          email: user.email,
        },
      };
    },
  },
};

export default NextAuth(authOptions);
