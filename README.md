# 📊 Factorial Metrics Dashboard

A professional, full-stack metrics dashboard built as a monorepo. This project allows users to visualize time-series data with precise controls for 24h, 7d, and 30d views.

**Live demo:** [https://factorial-metrics.onrender.com/](https://factorial-metrics.onrender.com/)

## 🚀 Quick Start

### Prerequisites

* **Node.js** (v18+)
* **npm** (v7+ for workspaces)

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ElinaBahirova/factorial-metrics.git
   cd factorial-metrics
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**

   Create a `.env` file in `apps/api` with your Neon database URL:
   ```text
   DATABASE_URL="postgres://user:password@neon-host/dbname"
   ```

   Optionally set `PORT` (default: 3001).

4. **Sync the database:**
   ```bash
   cd apps/api && npx prisma db push
   ```

5. **Run the project:**
   ```bash
   # From the root, run both frontend and backend
   npm run dev
   ```

   Or run separately: `npm run api` (API at http://localhost:3001) and `npm run web` (frontend at http://localhost:5173).

   To point the frontend at another API, create `apps/web/.env` with:
   ```text
   VITE_API_URL=http://localhost:3001
   ```

## 📂 Repository Structure

```text
📂 factorial-metrics
├── 📁 apps
│   ├── 📁 api          (Express + Prisma, TypeScript)
│   │   ├── lib/        (prisma, dateRange, aggregateMetrics, errors, middleware)
│   │   ├── repositories/
│   │   ├── routes/     (metrics, health)
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── types/
│   │   └── prisma/
│   └── 📁 web          (React + Mantine, Vite)
│       └── src/
│           ├── components/
│           ├── features/metrics/
│           ├── lib/
│           └── types/
├── 📄 package.json    (npm workspaces)
└── 📄 README.md
```

## 🏗 Project Architecture

This project is structured as a **monorepo** to keep the frontend and backend closely coupled while maintaining clear boundaries.

* **`apps/web`**: React frontend built with **Vite** and **Mantine UI**. Uses TanStack Router for the metrics list and metric detail page, TanStack Query for data fetching, and Mantine Charts for time-series visualization.
* **`apps/api`**: Node.js/Express server using **Prisma 7** for database access, with a service/repository layer for clear separation of concerns.

## 🧠 Key Technical Decisions

### 1. Charts: Time Scale vs. Category Scale

**Decision:** Implemented a numeric X-axis (`type="number"`) instead of the default category labels.

* **Why:** Default category scales treat "1 minute" and "20 hours" as equal distances if they are consecutive data points. Using a time scale ensures the distance between points reflects the actual time elapsed, providing a truthful representation of data trends.

### 2. UI: Factorial Design System Replication

**Decision:** Extended the Mantine theme with a custom "Factorial" palette and specific component overrides.

* **Secondary Palette:** Added Teal, Blue, and Amber to distinguish multiple metrics.
* **Interaction States:** Used `:focus-within` and parent-selector logic to ensure input labels and borders change to teal simultaneously during user focus, matching the Factorial aesthetic without using `!important`.

### 3. Date Handling: `date-fns` over `Day.js`

**Decision:** Chose `date-fns` for its functional programming approach and superior tree-shaking capabilities.

* **Why:** This keeps the frontend bundle lean by only importing the specific formatting functions needed for the dashboard.

### 4. Database: Prisma 7 + Neon

**Decision:** Leveraged Prisma's type-safe ORM with Neon's serverless Postgres.

* **Why:** Prisma ensures the API stays maintainable with auto-generated types, while Neon allows for effortless scaling and instant branching during development.

## 🛠 Tech Stack

* **Frontend:** React, Mantine UI, Mantine Charts, TanStack Query, TanStack Router, date-fns.
* **Backend:** Express, TypeScript, Prisma ORM.
* **Database:** PostgreSQL (Neon).
* **Deployment:** Render (API) and Vercel (Web).

## 📜 Scripts (root)

| Command        | Description                          |
|----------------|--------------------------------------|
| `npm run dev`  | Run API and web dev servers          |
| `npm run api`  | Run API only (port 3001)             |
| `npm run web`  | Run web app only (port 5173)         |
| `npm run build`| Build all apps                       |
| `npm run lint` | Lint the project                     |

## 🔧 Environment Variables

| App   | Variable       | Required | Description                                |
|-------|----------------|----------|--------------------------------------------|
| API   | `DATABASE_URL` | Yes      | PostgreSQL connection string (e.g. Neon). |
| API   | `PORT`         | No       | Server port (default: 3001).               |
| Web   | `VITE_API_URL` | No       | API base URL (default: http://localhost:3001). |
