# TherapyFlow

Mental Health & Therapy Management Platform

## Problem Statement

Mental health professionals and patients face challenges in managing therapy sessions and progress:
- Inconsistent session scheduling and tracking
- Limited progress monitoring tools
- Fragmented communication between sessions
- Lack of integrated assessment tools
- Difficulty accessing therapy resources

## Solution

TherapyFlow provides a comprehensive therapy management ecosystem that:
- Streamlines session scheduling and management
- Provides progress tracking and analytics
- Facilitates secure communication between therapists and patients
- Integrates assessment tools and resources
- Offers data-driven insights for treatment optimization

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **State Management**: Redux Toolkit
- **Backend**: Supabase (PostgreSQL)
- **Visualization**: D3.js
- **Deployment**: Vercel

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Add your Supabase credentials to `.env.local`

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

## Database Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Run the migration in `supabase/migrations/001_initial_schema.sql` in your Supabase SQL editor
3. Update `.env.local` with your Supabase URL and anon key

## Project Structure

```
src/
├── app/              # Next.js app router pages
├── components/       # React components
├── lib/             # Supabase client & utilities
├── store/           # Redux store & slices
└── types/           # TypeScript type definitions
```

## Goals (2026)

- 500 active therapist accounts in year one
- 2,000 patient users
- Comprehensive therapy management platform

## License

MIT
