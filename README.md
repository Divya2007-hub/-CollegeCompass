# 🎓 CollegeCompass — College Discovery Platform

A production-ready full-stack college discovery platform built with **Next.js 15**, **TypeScript**, **Prisma**, **PostgreSQL**, and **Auth.js**.

---

## ✨ Features

| Feature | Details |
|---|---|
| 🔍 College Discovery | Search, filter by location/fees/rating/type, card & table views, pagination |
| 📄 College Detail | Overview, courses, placement stats, student reviews |
| ⚖️ Compare Colleges | Side-by-side comparison of up to 3 colleges |
| 🔐 Authentication | Email/password registration & login via Auth.js (NextAuth v5) |
| 🔖 Saved Colleges | Save/unsave colleges, personal dashboard |
| 📱 Responsive UI | Mobile-first Tailwind CSS design |
| 🌱 Seeded Data | 25 real Indian colleges with courses, placements, and reviews |

---

## 🏗️ Tech Stack

**Frontend**
- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS 3

**Backend**
- Next.js API Routes
- Auth.js (NextAuth v5) with Prisma Adapter
- Zod for request validation
- bcryptjs for password hashing

**Database**
- PostgreSQL (Neon for production)
- Prisma ORM

**Deployment**
- Vercel (frontend + API)
- Neon (serverless PostgreSQL)

---

## 📁 Folder Structure

```
college-platform/
├── prisma/
│   ├── schema.prisma          # Database models
│   └── seed.ts                # 25 college seed data
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── [...nextauth]/route.ts   # Auth.js handler
│   │   │   │   └── register/route.ts        # User registration
│   │   │   ├── colleges/
│   │   │   │   ├── route.ts                 # List + filter colleges
│   │   │   │   └── [id]/route.ts            # College detail
│   │   │   ├── reviews/route.ts             # CRUD reviews
│   │   │   ├── saved-colleges/route.ts      # Save/unsave colleges
│   │   │   └── compare/route.ts             # Compare endpoint
│   │   ├── auth/
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   └── error/page.tsx
│   │   ├── colleges/
│   │   │   ├── page.tsx                     # Listing with filters
│   │   │   └── [id]/
│   │   │       ├── page.tsx                 # Detail page (SSR)
│   │   │       └── CollegeDetailClient.tsx  # Client save button
│   │   ├── compare/page.tsx                 # Compare page
│   │   ├── saved/page.tsx                   # Saved colleges
│   │   ├── dashboard/page.tsx               # User dashboard
│   │   ├── not-found.tsx
│   │   ├── layout.tsx                       # Root layout + providers
│   │   ├── page.tsx                         # Homepage
│   │   └── globals.css
│   ├── components/
│   │   ├── layout/
│   │   │   └── Header.tsx
│   │   ├── college/
│   │   │   ├── CollegeCard.tsx
│   │   │   └── CollegeFilters.tsx
│   │   └── ui/
│   │       ├── StarRating.tsx
│   │       ├── Skeleton.tsx
│   │       ├── Pagination.tsx
│   │       └── EmptyState.tsx
│   ├── lib/
│   │   ├── prisma.ts          # Prisma singleton
│   │   ├── auth.ts            # Auth.js config
│   │   └── utils.ts           # Utility functions
│   └── types/
│       ├── index.ts           # App-wide TypeScript types
│       └── next-auth.d.ts     # Session type extension
├── .env.example
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── vercel.json
```

---

## 🗄️ Database Schema

```prisma
User         → id, name, email, password, accounts, sessions
College      → id, name, location, city, state, fees, rating,
               description, placements (JSON), type, image,
               established, website, accreditation
Course       → id, collegeId, name, duration, fees, seats, degree
Review       → id, collegeId, userId, rating, comment, title, pros, cons
SavedCollege → id, userId, collegeId (unique composite)
Account      → NextAuth OAuth accounts
Session      → NextAuth sessions
```

---

## 🚀 Local Setup

### Prerequisites
- Node.js 18+
- PostgreSQL (local) OR a [Neon](https://neon.tech) account (free tier)

### 1. Clone and install

```bash
git clone https://github.com/your-username/college-platform.git
cd college-platform
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
DATABASE_URL="postgresql://user:pass@localhost:5432/college_db"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Set up database

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database (creates tables)
npm run db:push

# Seed with 25 colleges + demo user
npm run db:seed
```

### 4. Start development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

**Demo login:** `demo@college.com` / `demo@123`

---

## 🌐 Production Deployment (Vercel + Neon)

### Step 1 — Create Neon Database

1. Go to [neon.tech](https://neon.tech) → Create account → New Project
2. Select region closest to your users (e.g., `ap-southeast-1` for India)
3. Copy the **Connection string** (looks like `postgresql://...`)

### Step 2 — Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Or push to GitHub and import the repo at [vercel.com/new](https://vercel.com/new).

### Step 3 — Set Environment Variables in Vercel

In your Vercel project → Settings → Environment Variables:

| Variable | Value |
|---|---|
| `DATABASE_URL` | Your Neon connection string |
| `NEXTAUTH_SECRET` | `openssl rand -base64 32` output |
| `NEXTAUTH_URL` | `https://your-app.vercel.app` |

### Step 4 — Run migrations on production

```bash
# Set DATABASE_URL to your Neon URL, then:
npx prisma db push
npx tsx prisma/seed.ts
```

Or add a one-time seed script to your Vercel deployment via the Vercel CLI.

---

## 📡 API Reference

### Colleges

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/colleges` | List colleges with filters |
| GET | `/api/colleges/:id` | College detail |

**Query params for GET /api/colleges:**
```
search      - College name search
location    - City or state filter
minFee      - Minimum annual fee
maxFee      - Maximum annual fee
minRating   - Minimum rating (0-5)
type        - GOVERNMENT | PRIVATE | DEEMED | AUTONOMOUS
page        - Page number (default: 1)
limit       - Results per page (default: 9, max: 20)
sortBy      - name | fees | rating
sortOrder   - asc | desc
```

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Create new account |
| POST | `/api/auth/signin` | Sign in (NextAuth) |
| POST | `/api/auth/signout` | Sign out (NextAuth) |

### Reviews (Authenticated)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/reviews?collegeId=` | List reviews for a college |
| POST | `/api/reviews` | Submit a review |

### Saved Colleges (Authenticated)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/saved-colleges` | Get user's saved colleges |
| POST | `/api/saved-colleges` | Save a college |
| DELETE | `/api/saved-colleges?collegeId=` | Remove saved college |

### Compare

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/compare?ids=id1,id2,id3` | Compare 2-3 colleges |

---

## 🔧 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # ESLint

npm run db:generate  # Generate Prisma client
npm run db:push      # Sync schema to DB (no migration files)
npm run db:migrate   # Create migration files
npm run db:seed      # Seed 25 colleges + demo user
npm run db:studio    # Open Prisma Studio (DB GUI)
```

---

## 🔒 Security Features

- Passwords hashed with **bcryptjs** (12 salt rounds)
- Session tokens via **JWT** (stateless, no DB lookups per request)
- All mutating API routes protected with `auth()` session check
- Input validation on all POST routes using **Zod**
- SQL injection protection via **Prisma ORM** (parameterized queries)

---

## 🧩 Extending the Platform

### Add OAuth (Google/GitHub)

In `src/lib/auth.ts`, add providers:

```ts
import GoogleProvider from "next-auth/providers/google";

providers: [
  GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  }),
  // ... existing CredentialsProvider
]
```

### Add more colleges

Edit `prisma/seed.ts` and add entries to the `colleges` array, then re-run:

```bash
npm run db:seed
```

### Add image upload

Integrate [Cloudinary](https://cloudinary.com) or [UploadThing](https://uploadthing.com) for college image uploads in the admin flow.

---

## 📄 License

MIT — free to use, modify, and deploy.

---

Built with ❤️ using Next.js 15, Prisma, PostgreSQL & Tailwind CSS.
