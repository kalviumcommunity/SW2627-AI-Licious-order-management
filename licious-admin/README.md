# Licious Order Management Admin

## Project Overview

Licious Order Management Admin is a React + Vite frontend application for managing orders, inventory, and order details in an admin dashboard.

This admin portal includes Supabase authentication, client-side mock data for orders and inventory, and pages for login, dashboard, order details, and inventory management.

## Features

- Supabase email/password authentication
- OTP login via Supabase email-based sign-in
- Admin dashboard with navigation tabs for orders, inventory, users, products, offers, reports, and settings
- Mock live orders and completed orders views
- Order detail view with invoice download and print support
- Inventory management with stock adjustment, add/delete product actions, and audit-like inventory logs
- Search and filter for orders and inventory items
- Responsive sidebar and mobile-friendly layout
- Custom dashboard stats, sales overview chart, and order overview visualization

## Tech Stack

- React 19
- Vite 8
- React Router DOM
- Tailwind CSS
- Supabase JavaScript client
- Lucide React icons
- ESLint

## Project Structure

```text
licious-admin/
  package.json
  README.md
  env.example
  vite.config.js
  public/
  src/
    App.jsx
    main.jsx
    index.css
    App.css
    lib/
      supabase.js
    pages/
      LoginPage.jsx
      DashboardPage.jsx
      OrderDetailsPage.jsx
      InventorySection.jsx
    assets/
```

## Installation

1. Clone the repository.
2. Install the root dependencies:

```bash
npm install
```

3. Install the admin app dependencies:

```bash
cd licious-admin
npm install
```

## Environment Variables

Create a `.env` file in `licious-admin/` using `env.example` and provide the following values:

```env
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

These variables enable Supabase authentication in the admin portal.

## Running the Project

From the repository root:

```bash
npm run dev
```

Or from the admin directory:

```bash
cd licious-admin
npm run dev
```

Then open the local Vite development URL shown in the terminal.

## Available Scripts

### Root package.json

- `npm run dev` - starts the admin frontend in development mode via `npm --prefix ./licious-admin run dev`
- `npm run build` - builds the admin frontend via `npm --prefix ./licious-admin run build`
- `npm run preview` - previews the built site via `npm --prefix ./licious-admin run preview`
- `npm test` - placeholder script (no tests configured)

### `licious-admin/package.json`

- `npm run dev` - start Vite development server
- `npm run build` - build production assets
- `npm run preview` - preview a production build locally
- `npm run lint` - run ESLint on the admin source

## Build & Deployment

Build the admin app from the repository root:

```bash
npm run build
```

This generates a production-ready build for the admin portal in `licious-admin/dist/`.

To preview the production build locally:

```bash
npm run preview
```

For deployment, serve the files in `licious-admin/dist/` with a static hosting provider or web server.

## Architecture

- `licious-admin/src/App.jsx` handles authentication state and routing.
- `licious-admin/src/lib/supabase.js` creates the Supabase client using environment values.
- `licious-admin/src/pages/LoginPage.jsx` provides login, signup, and OTP flows.
- `licious-admin/src/pages/DashboardPage.jsx` renders the main admin interface, including order and inventory views.
- `licious-admin/src/pages/OrderDetailsPage.jsx` shows detailed order information, invoice printing, and download actions.
- `licious-admin/src/pages/InventorySection.jsx` provides a searchable and filterable inventory list.
- State is managed with React hooks (`useState`, `useMemo`) and data is currently stored in client-side mock arrays.

## APIs, Database, Authentication, and State Management

- Authentication: Supabase authentication is used for sign-in, sign-up, OTP login, and sign-out.
- Database/API: No backend API routes or database persistence files are present in this repository. Order and inventory data are currently mocked in the frontend.
- State management: Local React component state is used across pages.

## Screenshots

> Screenshots are not included in the repository. Add visuals here once available.

## Future Improvements

- Connect the frontend to a real backend and persist orders and inventory to a database.
- Implement real-time order updates using a live feed or WebSocket/Supabase realtime events.
- Add unit and integration tests for authentication and dashboard workflows.
- Extend the admin portal with real user management and backend-driven reports.

## Contributors

- Project source based on repository: https://github.com/kalviumcommunity/SW2627-AI-Licious-order-management

## License

This project is licensed under the `ISC` license.
