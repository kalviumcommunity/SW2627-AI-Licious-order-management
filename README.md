# Licious Order Management

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%26%20Database-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/license/isc-license-txt)

Licious Order Management is an admin-focused web application for viewing and managing a food-order operation. It provides a single dashboard for order workflows, product and inventory views, offers, reports, and settings. The current implementation combines Supabase authentication with client-side dashboard state; some operational views use seeded or in-memory data while the repository also includes a Supabase schema and read services for inventory, offers, orders, and settings.

## Features

- Email/password sign-in, sign-up, sign-out, and password recovery through Supabase Auth.
- Dashboard views for live and completed orders, including order-detail, status, print, and download actions.
- Product and inventory interfaces with search, filtering, and stock-status presentation.
- Offer, reporting, and settings screens.
- Responsive React interface with Vite, Tailwind CSS, and Lucide icons.

## Technology stack

| Area | Technology |
| --- | --- |
| Admin application | React 19, React Router DOM, Vite 8 |
| Styling | Tailwind CSS 4 and component CSS |
| Authentication and data access | Supabase JavaScript client |
| Database definition | PostgreSQL SQL for Supabase |
| Tooling | ESLint, npm |

## Repository structure

```text
.
├── licious-admin/             # React/Vite administration application
│   ├── public/                # Static branding assets
│   ├── src/
│   │   ├── pages/             # Dashboard, login, inventory, offers, settings, and product UI
│   │   ├── services/          # Supabase read services
│   │   └── lib/supabase.js    # Supabase client configuration
│   ├── env.example            # Required browser-exposed environment variable names
│   └── README.md              # Admin module documentation
├── supabase/schema.sql        # Database schema, RLS policies, and optional seed records
├── package.json               # Root command wrappers
└── README.md
```

## Prerequisites

- Node.js and npm.
- A Supabase project if you need authentication or the Supabase-backed screens.

## Setup and installation

```bash
git clone https://github.com/kalviumcommunity/SW2627-AI-Licious-order-management.git
cd SW2627-AI-Licious-order-management
npm install
cd licious-admin
npm install
```

To prepare Supabase, run [`supabase/schema.sql`](supabase/schema.sql) in the Supabase SQL Editor. It creates the inventory, order, offer, and application-settings tables, associated row-level-security policies, and optional inventory seed records. Use an appropriate Supabase project and review the SQL before applying it to an existing database.

## Environment variables

Copy the admin example file to `licious-admin/.env` and replace the placeholders with your Supabase project values:

```bash
cd licious-admin
Copy-Item env.example .env
```

```env
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

| Variable | Purpose |
| --- | --- |
| `VITE_SUPABASE_URL` | URL of the Supabase project used by the browser client. |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key used by the browser client. |

The application detects missing placeholder values and displays a configuration message instead of initializing the Supabase client. In Supabase Auth, configure the redirect URL for `<your-app-url>/reset-password` to support password recovery.

## Run the project

From the repository root:

```bash
npm run dev
```

Or run the admin app directly:

```bash
cd licious-admin
npm run dev
```

Vite prints the local development URL in the terminal. For a production build and local preview:

```bash
npm run build
npm run preview
```

The production files are generated in `licious-admin/dist/`.

## Commands

| Command | Run from | Description |
| --- | --- | --- |
| `npm run dev` | repository root | Starts the admin Vite development server. |
| `npm run build` | repository root | Builds the admin application. |
| `npm run preview` | repository root | Previews the built admin application. |
| `npm run lint` | `licious-admin/` | Lints the admin source. |

## Team

The following contributors are identified from the repository Git history:

- Pravin-018
- Sriram Manikandan
- p.sanvi sri

## Future enhancements

- Connect all dashboard workflows to persistent backend operations rather than client-side state or seeded data.
- Add automated unit, integration, and end-to-end tests.
- Implement real-time order and inventory updates using Supabase Realtime or an equivalent event channel.
- Add production-ready user management, reports, and authorization rules.

## License

Licensed under the [ISC License](https://opensource.org/license/isc-license-txt).

For application-specific details, see the [admin module README](licious-admin/README.md).
