import { authOptions } from "@/lib/auth-options";
import NextAuth from "next-auth/next";
import { NextRequest } from "next/server"; // Utilise NextRequest

const handler = NextAuth(authOptions);

export async function GET(req: NextRequest) {
  return handler(req);
}

export async function POST(req: NextRequest) {
  return handler(req);
}
