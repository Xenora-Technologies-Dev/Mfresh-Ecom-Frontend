# MFresh UAE — Frontend v1.0.0

Premium B2B food marketplace frontend built with Next.js, TypeScript, and Tailwind CSS.

## Tech Stack

- **Next.js 16** (App Router)
- **React 19** + **TypeScript**
- **Tailwind CSS v4**
- **shadcn/ui** (Radix UI primitives)
- **Framer Motion** — animations
- **TanStack React Query** — data fetching
- **Zustand** — client state (favorites)

## Getting Started

```bash
cd Frontend
npm install
npm run dev
```

Open [http://localhost:3006](http://localhost:3006).

## Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_SITE_URL` | Public site URL | `https://mfresh.ae` |
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:4000/api/v1` |

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
├── components/
│   ├── ui/              # shadcn-style primitives
│   ├── layout/          # Header, Footer, Search
│   ├── home/            # Homepage sections
│   ├── products/        # Product cards & filters
│   ├── categories/      # Category cards
│   ├── suppliers/       # Supplier cards
│   └── shared/          # Reusable sections
├── lib/
│   ├── api/             # API service layer (mock-ready)
│   ├── constants.ts     # Theme, nav, site config
│   └── utils.ts
├── data/mock/           # Mock data (v1.0.0)
├── hooks/
├── providers/
├── store/
└── types/
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage with hero, categories, products, suppliers, testimonials |
| `/about` | About MFresh UAE |
| `/contact` | Contact form |
| `/categories` | All categories |
| `/products` | Product listing with filters |
| `/products/[slug]` | Product detail |
| `/search` | Global search (products, categories, suppliers) |
| `/suppliers` | Supplier directory |
| `/become-buyer` | Buyer registration |
| `/become-seller` | Seller registration |
| `/faqs` | FAQs |
| `/privacy` | Privacy policy |
| `/terms` | Terms of service |

## Theme

| Token | Value |
|-------|-------|
| Primary (Navy) | `#1A3A6B` |
| Primary Dark | `#0F2442` |
| Secondary (Red) | `#E31937` |
| Light Gray | `#F4F6F9` |
| Dark Gray | `#1A2E44` |

Typography: **Plus Jakarta Sans**

## API Layer

The API service layer in `src/lib/api/` connects to the NestJS backend. All storefront pages fetch live data with React Query (caching, retry, error toasts).

## Deployment (Netlify)

```bash
npm run build
```

Netlify settings:
- **Build command:** `npm run build`
- **Publish directory:** `.next` (use Next.js Netlify plugin) or configure `@netlify/plugin-nextjs`

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Production server |
| `npm run lint` | ESLint |

## Version

**1.0.0** — Foundation release with all core pages, mock API, premium UI, and responsive design. No authentication yet.
