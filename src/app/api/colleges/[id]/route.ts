// src/app/api/colleges/[id]/route.ts
// GET /api/colleges/:id - Get full college details

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    const college = await prisma.college.findUnique({
      where: { id },
      include: {
        courses: { orderBy: { fees: "asc" } },
        reviews: {
          orderBy: { createdAt: "desc" },
          take: 10,
          include: {
            user: { select: { id: true, name: true, image: true } },
          },
        },
        _count: { select: { reviews: true, savedBy: true } },
      },
    });

    if (!college) {
      return NextResponse.json(
        { success: false, error: "College not found" },
        { status: 404 }
      );
    }

    let isSaved = false;
    if (session?.user?.id) {
      const saved = await prisma.savedCollege.findUnique({
        where: {
          userId_collegeId: { userId: session.user.id, collegeId: id },
        },
      });
      isSaved = !!saved;
    }

    return NextResponse.json({
      success: true,
      data: { ...college, isSaved },
    });
  } catch (error) {
    console.error("College detail error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch college details" },
      { status: 500 }
    );
  }
}
