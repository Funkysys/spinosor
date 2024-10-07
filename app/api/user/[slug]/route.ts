import prisma from "@/lib/connect";
import { NextResponse } from "next/server";

// GET SINGLE POST
export const GET = async (
  req: Request,
  { params }: { params: { slug: string } }
) => {
  const { slug } = params;

  try {
    const user = await prisma.user.findUnique({
      where: { email: slug },
    });

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "something went wrong !" },
      { status: 500 }
    );
  }
};

export const DELETE = async (
  req: Request,
  { params }: { params: { slug: string } }
) => {
  const { slug } = params;

  try {
    const user = await prisma.user.delete({
      where: { email: slug },
    });

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
};
