import prisma from "@/lib/connect";
import { NextResponse } from "next/server";

export const GET = async (
  req: Request,
  { params }: { params: { slug: string } }
) => {
  try {
    const { slug } = params;
    const email = await prisma.email.findUnique({
      where: {
        email: slug as string,
      },
    });

    return NextResponse.json(email, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
};
