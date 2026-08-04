# Licious Admin Application

This folder contains the Licious Order Management administration interface. It is a React single-page application built with Vite. Authenticated users can navigate dashboard, order, product, inventory, offer, report, and settings views; the login screen also supports sign-up and password-recovery flows through Supabase Auth.

Repository-wide setup, the database schema, and contributor information are documented in the [root README](../README.md).

## Module responsibilities

| Area | What it does |
| --- | --- |
| Authentication | Initializes a Supabase session, handles sign-in/sign-up/sign-out, and completes password recovery at `/reset-password`. |
| Navigation | Maps application URLs to dashboard tabs and redirects unknown routes to `/`. |
| Dashboard | Presents summary, live-order, completed-order, order-detail, report, and settings interfaces. |
| Catalog operations | Provides product and inventory views; inventory data is read through the Supabase service when configured. |
| Offers | Lists and displays offers through the Supabase service when configured. |

## Local setup

From this directory:

```bash
npm install
Copy-Item env.example .env
```

Set the following values in `.env`:

```env
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Both values are required to enable Supabase. They are Vite client variables, so use only the Supabase anonymous key here—never a service-role key. For password recovery, add `<your-app-url>/reset-password` to Supabase Auth's allowed redirect URLs.

Start the application:

```bash
npm run dev
```

Vite reports the development URL in the terminal. To validate and serve a production build locally:

```bash
npm run lint
npm run build
npm run preview
```

## Important files and folders

```text
licious-admin/
├── env.example              # Names of required Supabase variables
├── vite.config.js           # React and Tailwind Vite plugins
├── public/                  # Logos and other static assets
└── src/
    ├── main.jsx             # React entry point and browser router
    ├── App.jsx              # Session lifecycle and route definitions
    ├── lib/supabase.js      # Safe Supabase-client initialization
    ├── services/database.js # Read services for inventory, offers, orders, and settings
    ├── pages/               # Screen-level React components
    └── assets/              # Product and interface image assets
```

## Routes

| Route | Screen |
| --- | --- |
| `/` | Dashboard |
| `/live-orders`, `/completed-orders` | Order workflow views |
| `/order/:id` | Order details |
| `/products`, `/inventory`, `/offers`, `/offers/:id` | Catalog and offer views |
| `/reports`, `/settings` | Reporting and settings views |
| `/reset-password` | Supabase password recovery |

## Notes on data

`src/services/database.js` contains read helpers for the Supabase tables defined in `../supabase/schema.sql`. Several dashboard and management interactions currently maintain their data in component state, so configuring Supabase does not make every screen persist changes. This distinction is intentional in the current implementation and should be considered when extending the module.
