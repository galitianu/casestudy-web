# Employee Case Study Web

Small Next.js app for an employee directory case study.

It renders the employee list on the server, hydrates it into TanStack Query, and lets you create new employees through a server action that calls the Java API directly.

## Stack

- Next.js (App Router)
- React
- TanStack Query
- shadcn/ui primitives
- react-hook-form + zod

## Requirements

- `pnpm`
- A running backend API
- `EMPLOYEE_API_URL` set to the Java service base URL

Example:

```
EMPLOYEE_API_URL=http://localhost:8080
```

## Run

```bash
pnpm install
pnpm dev
```

App URL: [http://localhost:3000](http://localhost:3000)

## Scripts

```bash
pnpm dev
pnpm lint
pnpm build
pnpm start
```
