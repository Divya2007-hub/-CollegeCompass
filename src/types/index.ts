// src/types/index.ts
// Centralized TypeScript types used across the platform

export interface College {
  id: string;
  name: string;
  location: string;
  city: string;
  state: string;
  fees: number;
  rating: number;
  description: string;
  placements: PlacementData;
  image?: string | null;
  established?: number | null;
  website?: string | null;
  accreditation?: string | null;
  type: CollegeType;
  createdAt: Date;
  updatedAt: Date;
  courses?: Course[];
  reviews?: Review[];
  _count?: {
    reviews: number;
    savedBy: number;
  };
  isSaved?: boolean;
}

export type CollegeType = "GOVERNMENT" | "PRIVATE" | "DEEMED" | "AUTONOMOUS";

export interface PlacementData {
  averageSalary: number;
  highestSalary: number;
  placementRate: number;
  topRecruiters: string[];
}

export interface Course {
  id: string;
  collegeId: string;
  name: string;
  duration: string;
  fees: number;
  seats?: number | null;
  degree: string;
  createdAt: Date;
}

export interface Review {
  id: string;
  collegeId: string;
  userId: string;
  rating: number;
  comment: string;
  title?: string | null;
  pros?: string | null;
  cons?: string | null;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    name?: string | null;
    image?: string | null;
  };
}

export interface User {
  id: string;
  name?: string | null;
  email: string;
  image?: string | null;
}

export interface SavedCollege {
  id: string;
  userId: string;
  collegeId: string;
  createdAt: Date;
  college: College;
}

// API request/response types
export interface CollegeFilters {
  search?: string;
  location?: string;
  minFee?: number;
  maxFee?: number;
  minRating?: number;
  type?: CollegeType;
  page?: number;
  limit?: number;
  sortBy?: "name" | "fees" | "rating" | "established";
  sortOrder?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface CreateReviewInput {
  collegeId: string;
  rating: number;
  comment: string;
  title?: string;
  pros?: string;
  cons?: string;
}
