# TripSplit 🧳💸

**Group Travel Expense Tracker**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

## Authors

- **Yazi Zhang** — Expense Manager (CRUD)
- **Jianyu Qiu** — Member & Balance Manager (CRUD)

## Class Link

[CS5610 Web Development](https://johnguerra.co/classes/webDevelopment_spring_2025/)

## Project Objective

TripSplit helps groups of travelers log and split shared expenses during a trip. Users can record expenses (hotel stays, meals, transport, activities), manage trip members, and instantly see who owes what — making post-trip settlements painless.

## Screenshot

> _(Add a screenshot here after deployment)_

## Tech Stack

- **Frontend**: React 18 with Hooks, component-scoped CSS
- **Backend**: Node.js + Express (ES Modules)
- **Database**: MongoDB (native driver — no Mongoose)

## Project Structure

```
tripsplit/
├── backend/
│   ├── db/
│   │   └── connection.js       # MongoDB connection helper
│   ├── routes/
│   │   ├── expenses.js         # Expense CRUD routes (Yazi)
│   │   └── members.js          # Member CRUD routes (Jianyu)
│   ├── scripts/
│   │   └── seed.js             # Seed 1200+ synthetic records
│   ├── server.js               # Express entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ExpenseForm/    # Add / edit expense form
│   │   │   ├── ExpenseItem/    # Single expense row
│   │   │   ├── ExpenseList/    # Filterable expense list
│   │   │   └── ...             # Jianyu's member components
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── .eslintrc.json
├── .prettierrc
├── LICENSE
└── README.md
```

## Instructions to Build

### Prerequisites

- Node.js v18+
- A MongoDB Atlas cluster (free tier works)

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd tripsplit
```

### 2. Configure environment

Create `backend/.env`:

```
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/
DB_NAME=tripsplit
PORT=5000
```

> ⚠️ Never commit `.env` — it's in `.gitignore`

### 3. Install & run the backend

```bash
cd backend
npm install
npm run dev          # starts server on port 5000
```

### 4. Seed the database

```bash
cd backend
node scripts/seed.js  # inserts 1200+ synthetic expense records
```

### 5. Install & run the frontend

```bash
cd frontend
npm install
npm run dev          # starts Vite dev server, proxies /api → backend
```

### 6. Open in browser

```
http://localhost:5173
```

## How to Use

1. **Add a trip member** using the Members panel (Jianyu's section)
2. **Log an expense** — fill in description, amount, who paid, and category
3. **View all expenses** — filter by category or search by keyword
4. **Edit or delete** any expense using the action buttons
5. **Check balances** — the Members panel shows who owes what

## Deployment

The app is deployed at: _(add your Render / Railway / Vercel URL here)_

## License

[MIT](./LICENSE)
