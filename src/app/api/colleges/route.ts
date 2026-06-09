// src/app/api/colleges/route.ts
// GET /api/colleges - List colleges with search, filters and pagination

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Prisma } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search") || "";
    const location = searchParams.get("location") || "";
    const minFee = Number(searchParams.get("minFee")) || 0;
    const maxFee = Number(searchParams.get("maxFee")) || 99999999;
    const minRating = Number(searchParams.get("minRating")) || 0;
    const type = searchParams.get("type") || "";
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = Math.min(20, Math.max(1, Number(searchParams.get("limit")) || 9));
    const sortBy = (searchParams.get("sortBy") as "name" | "fees" | "rating") || "rating";
    const sortOrder = (searchParams.get("sortOrder") as "asc" | "desc") || "desc";

    const where: Prisma.CollegeWhereInput = {
      AND: [
        search ? { name: { contains: search, mode: "insensitive" } } : {},
        location ? {
          OR: [
            { city: { contains: location, mode: "insensitive" } },
            { state: { contains: location, mode: "insensitive" } },
            { location: { contains: location, mode: "insensitive" } },
          ]
        } : {},
        { fees: { gte: minFee, lte: maxFee } },
        minRating > 0 ? { rating: { gte: minRating } } : {},
        type ? { type: type as any } : {},
      ],
    };

    const [total, colleges] = await Promise.all([
      prisma.college.count({ where }),
      prisma.college.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          _count: { select: { reviews: true, savedBy: true } },
          courses: { take: 3, orderBy: { fees: "asc" } },
        },
      }),
    ]);

    // Check if user has saved each college
    let savedCollegeIds: Set<string> = new Set();
    if (session?.user?.id) {
      const saved = await prisma.savedCollege.findMany({
        where: { userId: session.user.id },
        select: { collegeId: true },
      });
      savedCollegeIds = new Set(saved.map((s) => s.collegeId));
    }

    const data = colleges.map((c) => ({
      ...c,
      isSaved: savedCollegeIds.has(c.id),
    }));

    return NextResponse.json({
      success: true,
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Colleges fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch colleges" },
      { status: 500 }
    );
  }
}
