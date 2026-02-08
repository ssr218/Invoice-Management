
# Dev Thoughts & Notes


# Development Notes / Thinking Process


Just dumping some context on why I built things this way.

## 1. The Stack (PERN-ish)

-   **Frontend**: React + Vite. It's fast, default choice.
-   **Backend**: Node/Express. Kept it simple.
-   **DB**: SQLite with Prisma.
    -   Honestly, setting up Postgres for a local review is a pain. SQLite works out of the box.
    -   Prisma is great because if we *did* switch to Postgres, it's like a 2-line config change.

## 2. Backend Logic

Split it into `controllers` and `routes`.
-   I hate massive `server.js` files.
-   Keeps the actual logic separate from the URL definitions.

### The Enum Problem
SQLite doesn't do Enums.
-   I wanted strict `PAID` / `UNPAID` statuses.
-   **Fix**: Left it as a String in the DB, but added a check in the controller to throw an error if you try to save anything else. Good enough for now.

## 3. Frontend Stuff

### CSS
-   Didn't use Tailwind. Partly to show I know actual CSS, partly because setting up the config for a small app feels like overkill.
-   **Design**: Went for a "boring internal tool" vibe. No round corners, high contrast. It's an invoice app, not a social network.

### Dashboard Stats
-   The dashboard needs totals (Paid vs Unpaid).
-   Instead of making 5 different API calls, I just grab all invoices in one go and calculate the totals in the controller.
-   *Note*: This would be a bad idea if we had 10,000 invoices (would crash the server memory), but for <1000 items, it's way faster to develop.

## 4. Auth (The "Lazy" Part)

-   It's hardcoded (`admin@example.com`).
-   Building a whole Sign Up / Forgot Password flow seemed like a waste of time for a demo about *Invoices*.
-   **But**: The security *mechanism* is real. It still issues a JWT, and the frontend still checks that token. So swapping in a real database user later would be easy.

<<<<<<< HEAD
## 5. If I had more time...
1.  **Pagination**: Definitely need this. Right now `findMany()` pulls everything.
2.  **PDFs**: Clients usually want to download the actual PDF invoice.
3.  **Real Auth**: bcrypt, user tables, etc.
=======
## 4. Auth

Kept it super simple. Hardcoded credentials in the controller. 
- Obviously wouldn't do this in prod, but for a demo, a `users` table is unnecessary complexity.
- JWT is still real though. Middleware checks the token on every invoice route.

## 5. Future Improvements (If I had more time)

- **Pagination**: Currently just dumping all invoices. Would break if we had 1000s.
- **Tax Calculation**: Everything is flat amount right now. 
- **PDF Export**: Users probably want to download the invoice. 

