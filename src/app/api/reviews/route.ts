// src/app/api/reviews/route.ts
// GET /api/reviews?collegeId=... - List reviews
// POST /api/reviews - Create a review (authenticated)

import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";


const reviewSchema = z.object({
  collegeId: z.string().cuid(),
  rating: z.number().min(1).max(5),
  comment: z.string().min(10, "Comment must be at least 10 characters"),
  title: z.string().optional(),
  pros: z.string().optional(),
  cons: z.string().optional(),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const collegeId = searchParams.get("collegeId");

    if (!collegeId) {
      return NextResponse.json(
        { success: false, error: "collegeId is required" },
        { status: 400 }
      );
    }

    const reviews = await prisma.review.findMany({
      where: { collegeId },
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, name: true, image: true } },
      },
    });

    return NextResponse.json({ success: true, data: reviews });
  } catch (error) {
    console.error("Reviews fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch reviews" },
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
    const parsed = reviewSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const { collegeId, ...reviewData } = parsed.data;

    // Check college exists
    const college = await prisma.college.findUnique({ where: { id: collegeId } });
    if (!college) {
      return NextResponse.json(
        { success: false, error: "College not found" },
        { status: 404 }
      );
    }

    const review = await prisma.review.upsert({
      where: { collegeId_userId: { collegeId, userId: session.user.id } },
      update: reviewData,
      create: { collegeId, userId: session.user.id, ...reviewData },
      include: {
        user: { select: { id: true, name: true, image: true } },
      },
    });

    // Update college average rating
    const avgResult = await prisma.review.aggregate({
      where: { collegeId },
      _avg: { rating: true },
    });

    if (avgResult._avg.rating) {
      await prisma.college.update({
        where: { id: collegeId },
        data: { rating: Math.round(avgResult._avg.rating * 10) / 10 },
      });
    }

    return NextResponse.json(
      { success: true, data: review, message: "Review submitted successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Review creation error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit review" },
      { status: 500 }
    );
  }
}
