# CreatorScribe Frontend

AI-powered content creation platform — Next.js 16 frontend with full auth architecture.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| State | Zustand 5 |
| HTTP | Axios 1.7 |
| Theme | next-themes |
| Components | @base-ui/react, custom primitives |
| Animation | framer-motion |

---

## Project Structure

```
creatorscribe_frontend/
├── app/
│   ├── layout.tsx              # Root layout — fonts, providers, AuthInitializer
│   ├── page.tsx                # Landing page
│   └── app/
│       ├── auth/
│       │   ├── layout.tsx      # Auth shell (logo, card)
│       │   ├── (auth)/
│       │   │   ├── layout.tsx  # Sign-in / Sign-up form UI
│       │   │   ├── sign-in/
│       │   │   └── sign-up/
│       │   ├── verify-otp/     # OTP verification page
│       │   └── reset-password/
│       └── home/               # Main app home
├── components/
│   ├── providers/
│   │   └── AuthInitializer.tsx # Calls initializeAuth on mount
│   ├── topbar.tsx
│   ├── app-sidebar.tsx
│   └── ui/                     # Local UI primitives
├── constants/
│   ├── config.ts               # App config + cookie name
│   └── routes.ts               # All route strings + middleware arrays
├── hooks/
│   ├── useAuth.ts              # Auth state selector + logout with redirect
│   └── useDebounce.ts
├── lib/
│   ├── axios.ts                # Axios instance with interceptors
│   └── utils.ts
├── services/
│   ├── auth.service.ts         # login, register, verifyOtp, logout, getMe…
│   └── user.service.ts
├── store/
│   ├── authStore.ts            # Zustand auth store with persist
│   ├── themeStore.ts
│   └── appStore.ts
├── types/
│   ├── api.ts                  # ApiResponse, AppError
│   └── user.ts                 # User, AuthTokens, payload types
└── middleware.ts               # Edge middleware — cookie-based route guard
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

| Variable | Description | Default |
|---|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | Backend API base URL | `http://localhost:8000/api/v1` |
| `NEXT_PUBLIC_APP_URL` | Frontend app URL | `http://localhost:3000` |

### Install & Run

```bash
npm install
npm run dev
```

---

## Architecture

### Auth Flow

```
Request
  → middleware.ts        (cookie presence check → redirect or allow)
  → app/layout.tsx       (server render)
  → AuthInitializer      (client: calls initializeAuth on mount)
      → GET /auth/me     (sets user in authStore)
      → on 401: POST /auth/refresh → retry GET /auth/me
      → on failure: clear state
  → All components read via useAuth() hook
```

### State Management

Auth state lives in `store/authStore.ts` (Zustand + persist middleware):

- `user` and `isAuthenticated` are persisted to `localStorage` under key `cs-auth-storage`
- The access token lives only in a cookie (`cs_access_token`) — never in localStorage directly
- `isInitializing` prevents auth flash on first load

### API Layer

All HTTP calls go through `lib/axios.ts`:

- **Request interceptor**: reads `cs_access_token` cookie, attaches `Authorization: Bearer` header
- **Response interceptor**: normalizes errors into `AppError` instances for consistent `instanceof` checking

### Error Handling

```typescript
try {
  await login({ email, password });
} catch (err) {
  if (err instanceof AppError) {
    // err.code, err.statusCode, err.message
  }
}
```

---

## Route Map

| URL | Component | Auth Required |
|---|---|---|
| `/app/auth/sign-in` | `(auth)/layout.tsx` | No (redirects if authed) |
| `/app/auth/sign-up` | `(auth)/layout.tsx` | No (redirects if authed) |
| `/app/auth/verify-otp` | `verify-otp/page.tsx` | No |
| `/app/auth/reset-password` | `reset-password/page.tsx` | No |
| `/app/home` | `home/page.tsx` | Yes |
| `/app/analytics` | (future) | Yes |
| `/app/content-calendar` | (future) | Yes |

---

## Component Patterns

### UI Primitives

All UI components live in `components/ui/` and are not tied to any component library — they accept standard HTML props and use `cn()` for class merging.

### Font Usage

| Variable | Font | Use |
|---|---|---|
| `--font-raleway` | Raleway | Primary headings, body |
| `--font-montserrat` | Montserrat | Labels, stats, numbers |
| `--font-jetbrains` | Ubuntu Mono | Code, monospace |

Apply with Tailwind classes: `font-raleway`, `font-montserrat`, `font-jetbrains`.

---

## Scripts

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```
