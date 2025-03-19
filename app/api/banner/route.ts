import prisma from "@/lib/connect";
import { NextResponse } from "next/server";

// export const GET_ACTIVE_BANNERS = async () => {
//   try {
//     const banners = await prisma.banner.findMany({
//       where: { isActive: true },
//     });
//     return NextResponse.json(banners);
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Failed to fetch active banners" },
//       { status: 500 }
//     );
//   }
// };

export const GET = async () => {
  try {
    const banners = await prisma.banner.findMany();
    return NextResponse.json(banners);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch banners" },
      { status: 500 }
    );
  }
};
