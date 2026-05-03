---
layout: ../layouts/Layout.astro
title: "Test Assignment — Mini Attendance App"
description: "Mini attendance app — take-home assignment."
---

# Test Assignment — Mini Attendance App

Build a small attendance application: a user logs how they spent each working day of a month. The goal is to evaluate how you design something small but real end-to-end (data model, API, frontend, auth, deployability).

You don't need to match my codebase. Pick what you're comfortable with. I care about a working, reasoned solution.

---

## 1. Domain

The app has three core entities. Stick to these names and relationships.

### User
- `id`, `email` (unique), `name`, `passwordHash`

### Assignment
The "thing" a time entry is logged against. Think of it as the work category.
- `id`, `name` (e.g. *Backend development*, *Vacation*), `code` (e.g. `BE-DEV`, `VAC`), `type` (`WORK`, `VACATION`, `HOLIDAY`)
- Seeded globally; users do not create assignments

### Attendance
One record per user per month — the container for a user's time entries in that month.
- `id`, `userId`, `year`, `month`
- Unique on `(userId, year, month)`
- Created lazily the first time a user opens a month

### TimeEntry
A single line: "on this day, I spent X minutes on this assignment".
- `id`, `attendanceId`, `assignmentId`, `date` (a day inside the attendance's month), `workedMinutes` (positive integer)
- Multiple entries per day are allowed (e.g. 6h `WORK` + 2h `VACATION`)

### Rules
- A user may only read or modify their own attendance and time entries.
- A `TimeEntry`'s `date` must fall within its `Attendance.year` / `month`.
- A user cannot log time for future dates.
- The total `workedMinutes` for any single date must not exceed 24 hours (1440 minutes). You can choose stricter limits if you justify them.

---

## 2. Functional requirements

### Authentication
- Email + password login. Sessions or JWTs are both fine — pick one and explain.
- Logout.
- Routes must be gated: only authenticated users see the app.

### Core flow
- Land on the current month's attendance after login.
- A month view (calendar grid or table — your call) showing each day with the time entries logged for it.
- Add / edit / delete a time entry on a day: pick assignment, enter duration (minutes or `HH:MM`).
- Switch between months (at minimum: previous month).

### Data validation
Both server- and client-side validation are expected. Server-side is non-negotiable; client-side is for UX. State your validation rules clearly in the README.

---

## 3. Non-functional requirements

### Multiple seeded users
The app must come up empty-but-usable after a single command. Provide a seed that creates at least:
- 3 users — credentials documented in the README
- 5–10 assignments covering all three `type`s
- For 1–2 of the users, a fully filled-in prior month

Seed credentials may be hard-coded (`alice@example.com` / `password123` etc.). This is a dev artifact, not a production concern — but call it out in the README.

### Hosting / running it

**Required: Docker Compose.** `docker compose up` from a fresh clone must produce a working app reachable from a browser. That includes the database, server, web app, and the seed step.

Document in the README:
- The exact command(s) to start the stack
- The URL(s) to open
- The seeded credentials
- How to reset the database

A cloud deployment (Fly.io, Render, Railway, a VPS, anything) on top of that is a nice bonus, not required. If you do deploy, share the URL.

### Repository
- Public Git repo (GitHub / GitLab) or a zip — your choice
- A `README.md` with: setup steps, seeded credentials, your tech-stack choices and the *why*, a list of what you skipped or would add with more time
- Do not commit `.env` files with real secrets. A `.env.example` is expected.

---

## 4. Tech stack

**Recommended (this is what I use):**
- Backend: TypeScript + [Hono](https://hono.dev) + [tRPC](https://trpc.io) + [Prisma](https://www.prisma.io) + PostgreSQL + [better-auth](https://www.better-auth.com)
- Frontend: TypeScript + [TanStack Start](https://tanstack.com/start) + React + [Tailwind v4](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com)
- Tooling: [Biome](https://biomejs.dev), [pnpm](https://pnpm.io), [Vitest](https://vitest.dev)

**Required:**
- A relational database (PostgreSQL strongly preferred; MySQL/SQLite acceptable)
- A web frontend (any framework — React, Vue, Svelte, HTMX, plain HTML — your choice)
- A backend HTTP API (any language — Node/TS, Go, Python, Rust, etc.)

TypeScript is preferred but **not** mandatory. A clean, working Go/Python/Ruby solution is more interesting than a half-finished TS one. Pick a stack you can finish in.

I'll evaluate the *result*, not whether you matched my stack.

---

## 5. Stretch goals (optional)

Pick none, one, or several — only if the core is solid.

- Real-time updates across sessions / tabs (websocket / SSE / polling — say which)
- 2FA (TOTP)
- Password reset flow
- CSV export of a month's time entries
- i18n with at least 2 languages
- Bulk-fill: "fill the rest of the month with 8h `WORK` on weekdays"
- Tests — unit and/or end-to-end. Coverage isn't graded, but a few well-chosen tests on the validation logic are a strong signal.
- A CI pipeline (GitHub Actions / GitLab CI) that lints + tests + builds

---

## 6. What I look at when reviewing

Roughly in this order:

1. **Does it work?** Can I `docker compose up` and exercise the full flow end-to-end on the first try?
2. **Data model.** Are the constraints (uniqueness, FKs) enforced at the DB level where they should be?
3. **Authorization.** Can user A read or modify user B's data by guessing IDs? (If yes, you fail this section.)
4. **Validation.** What happens if I submit `workedMinutes: -60`? `99999`? A `date` outside the month? An empty assignment?
5. **Code organization.** Can someone find their way around in 10 minutes? File structure, naming, separation of concerns.
6. **README quality.** Setup instructions that work, documented trade-offs, an honest "what I'd do next" section.

---

## 7. Deadline & timing

**Deadline: end of the current month.**

In your submission, include rough timings for the major parts of the work — for example:
- DB + schema: 2h
- API + auth: 4h
- Frontend: 6h
- Docker / packaging: 1h
- README: 30m

I'm not grading by speed. I want the data to calibrate future assignments and to understand where you spent your effort.

---

## 8. Submission

Send a link to the repo (and the deployed URL, if any) to the email you received this from. Include in the body:
- Per-section timings (see above)
- Anything you'd want me to specifically look at
- Anything you'd do differently with more time

Good luck.
