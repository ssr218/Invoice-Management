
# Development Notes / Thinking Process

Just keeping track of some decisions I made while building this.

## 1. Backend Structure

Initially thought about just dumping everything in `server.js` since it's a small app, but that gets messy fast. Went with a standard `controllers` + `routes` split. 

- **Why**: Cleaner. Easier to test. 
- **Trade-off**: Slightly more boilerplate, but worth it if we ever add more features.

Also split `app.js` and `server.js` so I can test the app without starting the server port listener every time.

## 2. Database Choice

Used SQLite because setting up Postgres for a simple local assessment is overkill.

- **The Enumeration Issue**: SQLite doesn't support native Enums. 
- **Fix**: Defined `status` as a String in Prisma schema (`@default("UNPAID")`), but enforced the 'PAID'/'UNPAID' check in the controller. It's safe enough for this.

## 3. Frontend & Styling

Avoided Tailwind this time. Just used native CSS variables (`src/styles.css`). 

- **Why**: Wanted to show I understand CSS and not just classes.
- **The "Boring" Aesthetic**: The goal was "Enterprise Internal Tool". So I removed all the drop shadows, rounded corners, and gradients. Flat designs look more trustworthy for finance apps.

## 4. Auth

Kept it super simple. Hardcoded credentials in the controller. 
- Obviously wouldn't do this in prod, but for a demo, a `users` table is unnecessary complexity.
- JWT is still real though. Middleware checks the token on every invoice route.

## 5. Future Improvements (If I had more time)

- **Pagination**: Currently just dumping all invoices. Would break if we had 1000s.
- **Tax Calculation**: Everything is flat amount right now. 
- **PDF Export**: Users probably want to download the invoice. 

