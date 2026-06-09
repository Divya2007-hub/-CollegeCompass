// src/app/api/saved-colleges/route.ts
// GET /api/saved-colleges - Get user's saved colleges
// POST /api/saved-colleges - Save a college
// DELETE /api/saved-colleges?collegeId=... - Unsave a college

import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";


const saveSchema = z.object({
  collegeId: z.string().cuid(),
});

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const saved = await prisma.savedCollege.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        college: {
          include: {
            courses: { take: 3 },
            _count: { select: { reviews: true } },
          },
        },
      },
    });

    return NextResponse.json({ success: true, data: saved });
  } catch (error) {
    console.error("Saved colleges fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch saved colleges" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const parsed = saveSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Invalid college ID" },
        { status: 400 }
      );
    }

    const { collegeId } = parsed.data;

    const saved = await prisma.savedCollege.upsert({
      where: { userId_collegeId: { userId: session.user.id, collegeId } },
      update: {},
      create: { userId: session.user.id, collegeId },
    });

    return NextResponse.json(
      { success: true, data: saved, message: "College saved" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Save college error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save college" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const collegeId = searchParams.get("collegeId");

    if (!collegeId) {
      return NextResponse.json(
        { success: false, error: "collegeId is required" },
        { status: 400 }
      );
    }

    await prisma.savedCollege.deleteMany({
      where: { userId: session.user.id, collegeId },
    });

    return NextResponse.json({ success: true, message: "College removed from saved" });
  } catch (error) {
    console.error("Unsave college error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to remove saved college" },
      { status: 500 }
    );
  }
}
