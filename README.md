# Frontend: Next.js 14 (App Router) + TypeScript
cp .env.example .env.local   # NEXT_PUBLIC_API_URL = your backend URL
npm install
npm run dev                  # http://localhost:3000

Public site: /          (server-rendered from GET /api/site on every request)
Admin panel: /admin     (login with the ADMIN_EMAIL / ADMIN_PASSWORD from the backend seed)
Deploy: Vercel (set NEXT_PUBLIC_API_URL), then add that URL to the backend's CORS_ORIGIN.
