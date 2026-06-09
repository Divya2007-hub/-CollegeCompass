// src/app/api/compare/route.ts
// GET /api/compare?ids=id1,id2,id3 - Get up to 3 colleges for comparison

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const idsParam = searchParams.get("ids");

    if (!idsParam) {
      return NextResponse.json(
        { success: false, error: "ids parameter is required" },
        { status: 400 }
      );
    }

    const ids = idsParam.split(",").slice(0, 3).filter(Boolean);

    if (ids.length < 2) {
      return NextResponse.json(
        { success: false, error: "At least 2 college IDs required for comparison" },
        { status: 400 }
      );
    }

    const colleges = await prisma.college.findMany({
      where: { id: { in: ids } },
      include: {
        courses: { orderBy: { fees: "asc" } },
        _count: { select: { reviews: true } },
      },
    });

    // Sort by original order
    const sorted = ids
      .map((id) => colleges.find((c) => c.id === id))
      .filter(Boolean);

    return NextResponse.json({ success: true, data: sorted });
  } catch (error) {
    console.error("Compare error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch colleges for comparison" },
      { status: 500 }
    );
  }
}
