// src/types/next-auth.d.ts
// Extends NextAuth session types to include user id

import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}
