# Thinking Process - Invoice Management System

## 1. Design Decision: Modular Folder Structure

**Decision**: Splitting the backend into `routes/`, `controllers/`, and `middleware/`.
**Why**: Even for an intern-level project, this "Clean Architecture" approach separates the entry point (routes) from the business logic (controllers). It makes the codebase much easier to navigate and scale compared to keeping all logic in a single file like `server.js`.

## 2. Alternative Approach Considered: Redux for State Management

**Alternative**: Using Redux to manage the invoice list and authentication state globally.
**Why Chosen/Not Chosen**: While Redux is powerful for complex apps, I chose **not** to use it. For this assignment, React's built-in `useState` and `useEffect` are sufficient. Adding Redux would have introduced unnecessary boilerplate and violated the "do not over-engineer" constraint.

## 3. Guide: Adding `tax_amount`

If we were to add a `tax_amount` field to the system, the following changes would be required:

### Prisma Schema & Migration
- Add `taxAmount Float @default(0)` to the `Invoice` model in `schema.prisma`.
- Run `npx prisma migrate dev --name add_tax_amount` to update the SQLite database.

### Backend API Changes
- Update `invoice.controller.js`:
  - In `createInvoice`, extract `taxAmount` from `req.body` and include it in the `prisma.invoice.create` call.
  - In `updateInvoice`, include `taxAmount` in the update data.
  - Ensure the math for "Total Amount" respects whether `invoiceAmount` is inclusive or exclusive of tax.

### Frontend UI & Logic Changes
- **InvoiceForm.jsx**: Add a new input field for "Tax Amount". Update the `formData` state to include it.
- **InvoiceList.jsx**: Add a "Tax" column to the table to display this value for each invoice.
- **Dashboard.jsx**: Potentially add a "Total Tax Collected" stat card by aggregating the `taxAmount` from the fetched list.
