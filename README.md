# ClimaSell

Empowering Farmers through Predictive Analytics & Market Savvy

## Problem Statement

Smallholder farmers face challenges adapting to climate change and economic pressures:
- Inconsistent weather patterns
- Fluctuating market prices
- Limited access to quality inputs
- Opaque supply chains
- Lack of real-time data

## Solution

ClimaSell provides a comprehensive agricultural ecosystem that:
- Synchronizes weather analytics with market trends
- Provides accessibility to quality inputs at reduced costs
- Improves supply chain visibility
- Facilitates direct farmer-to-consumer connections

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

- 1,500 active farmer accounts in year one
- $3M in facilitated annual revenue
- Double user base in year two

## License

MIT
