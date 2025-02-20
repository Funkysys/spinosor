import GoogleProvider from "next-auth/providers/google";

import { PrismaAdapter } from "@next-auth/prisma-adapter";

import prisma from "@/lib/connect";
import { getServerSession } from "next-auth";
import type { Adapter } from "next-auth/adapters";

export const authOptions = {
  debug: true,
  adapter: PrismaAdapter(prisma) as Adapter,
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
  ],
};

export const getAuthSession = () => getServerSession(authOptions);
