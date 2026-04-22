# TripSplit 🧳💸

**Group Travel Expense Tracker**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://tripsplit-gold.vercel.app)

> A full-stack web app that helps travel groups log, split, and settle shared expenses — so you can focus on the trip, not the math.

---

## 📌 Table of Contents

- [Project Description](#-project-description)
- [Authors](#-authors)
- [Tech Stack](#-tech-stack)
- [User Personas](#-user-personas)
- [User Stories](#-user-stories)
- [Design Mockups](#-design-mockups)
- [Project Structure](#-project-structure)
- [Instructions to Build](#-instructions-to-build)
- [How to Use](#-how-to-use)
- [Deployment](#-deployment)
- [License](#-license)

---

## 📖 Project Description

Traveling in a group is fun — splitting  the bill is not. TripSplit is a **group travel expense tracker** that solves the classic problem: after a trip, nobody can remember who paid for what, and figuring out who owes whom becomes a frustrating spreadsheet exercise.

TripSplit lets a group of travelers:

- **Add members** to a shared trip
- **Log expenses** (meals, hotels, transport, activities, etc.) with the payer and amount
- **Browse and filter** expenses by category or keyword
- **See live balance summaries** — who has paid too much and who needs to pay back

The goal is a **lightweight, real-time ledger** that anyone in the group can update, with a clear view of who owes what.

### Key Features

| Feature | Description |
|---|---|
| Expense CRUD | Add, view, edit, and delete any expense entry |
| Member CRUD | Add and remove trip participants |
| Smart splitting | Choose which members share each expense |
| Category filtering | Filter expenses by type (Food & Drink, Transport, Accommodation, etc.) |
| Keyword search | Search through expense descriptions |
| Balance view | See per-member net balances (paid vs. owes) at a glance |
| Seed data | 1,200+ synthetic records for testing and demo |
| Cloud deployment | Hosted on Vercel with MongoDB Atlas backend |

### Usability & Accessibility Enhancements

- **Responsive Layouts**: Fluid form inputs and flexbox constraints (`min-width: 0`) prevent horizontal overflow on mobile screens, ensuring a seamless experience across all devices.
- **Smart Data Cascading**: Modifying a member's name seamlessly updates all their linked historical expenses, preventing orphaned records and confusion.
- **Accessible Selections**: Upgraded the `splitAmong` input to a visual multi-select checkbox group, making it intuitive and error-proof to select participants.
- **Enhanced Readability**: Expense cards now explicitly list the names of everyone involved in a split rather than just a generic number count, vastly improving transparency.

### Application Logic & Architecture Modifications

- **Group & Trip Isolation**: Overhauled the core logic to strictly associate all members and expenses with a specific `tripId`. This architectural shift natively supports multi-group concurrency, allowing independent travel groups to track ledgers simultaneously without data overlap.
- **User Authentication & Roles (Architecture Prep)**: The frontend and backend state management have been refactored to support user identity. While currently operating in a frictionless "open access" mode for easy onboarding, the API structure is pre-configured to integrate JWT-based authentication and Role-Based Access Control (RBAC) (e.g., differentiating between a Trip Admin who can delete expenses and a Trip Viewer).

### Class Context

Built for **CS5610 Web Development** at Northeastern University (Spring 2025), taught by [Professor John Alexis Guerra Gomez](https://johnguerra.co/classes/webDevelopment_spring_2025/).

---

## 👩‍💻 Authors

| Name | Contribution |
|---|---|
| **Yazi Zhang** | Expense Manager — full CRUD for expenses (frontend components + backend routes) |
| **Jianyu Qiu** | Member & Balance Manager — member CRUD + balance calculation logic |

---

## 🛠 Tech Stack

- **Frontend**: React 18 with Hooks, component-scoped CSS, Vite
- **Backend**: Node.js + Express (ES Modules)
- **Database**: MongoDB Atlas (native driver, no Mongoose)
- **Deployment**: Vercel (frontend + serverless API)

---

## 🧑‍🤝‍🧑 User Personas

### Persona 1 — Maya, the Trip Organizer

> *"I'm tired of being the one who pays for everything and then awkwardly chases people for money weeks later."*

- **Age**: 28
- **Occupation**: Product Manager, San Francisco
- **Travel style**: Organizes 2–3 group trips per year with 4–8 friends
- **Tech comfort**: High — uses Venmo, Splitwise, Google Docs regularly
- **Pain point**: She always ends up fronting large group expenses (Airbnb, rental cars) and loses track of reimbursements over time
- **Goal**: A shared, always-up-to-date ledger her whole group can see without creating accounts

---

### Persona 2 — David, the Reluctant Payer

> *"I just want to know what I owe at the end and pay it all at once. I don't care about the details."*

- **Age**: 34
- **Occupation**: Software Engineer, remote
- **Travel style**: Joins 1–2 group trips per year, usually as a guest rather than organizer
- **Tech comfort**: High technically, but low patience for UI friction
- **Pain point**: He doesn't pay attention to expenses during the trip and ends up with surprise debts at the end
- **Goal**: A simple, readable summary of his net balance so he can settle up in one Venmo transfer

---

### Persona 3 — Sophie, the Budget-Conscious Traveler

> *"I want to make sure we're not going over budget and that everyone is paying their fair share."*

- **Age**: 24
- **Occupation**: Graduate student, living on a tight budget
- **Travel style**: Occasional group trips with college friends; very cost-conscious
- **Tech comfort**: Moderate — comfortable with mobile apps but prefers simple interfaces
- **Pain point**: Unclear who paid for what leads to disputes; she worries about being taken advantage of
- **Goal**: Transparency — she wants to see every expense logged in real time with category breakdowns

---

## 📖 User Stories

### Story 1 — Logging a Group Dinner (Maya)

Maya and five friends just finished a big dinner in Tokyo. She paid $150 on her card. She opens TripSplit, clicks **+ Add Expense**, fills in the description, amount, date, category (*Food & Drink*), who paid, and checks the boxes for which friends to split it among. She hits **Add Expense**. The entry appears instantly in the list, and her balance updates to show she is owed money.

**Acceptance criteria:**
- User can fill and submit the expense form
- New expense appears in the list without page reload
- Balance panel updates to reflect the new payment

---

### Story 2 — Checking the Balance Before Checkout (David)

It's the last morning of the trip. David opens TripSplit, goes to the **Trip Balances** panel, and immediately sees a red badge showing he owes $277.03. He doesn't need to read every expense — he just Venmoes the right person and they're done. No awkward conversation needed.

**Acceptance criteria:**
- Balance panel shows each member's total paid, total owed, and net amount
- Red badge = owes money; green badge = gets money back
- Balances update in real time as expenses are added or removed

---

### Story 3 — Editing a Wrong Entry (Sophie)

Sophie notices the hotel expense was logged with the wrong amount. She finds it in the expense list, clicks the **edit icon**, corrects the amount, and saves. The list and balances update instantly.

**Acceptance criteria:**
- Each expense row has an edit button
- Clicking edit pre-fills the form with existing data
- Saving updates the record in MongoDB and re-renders the list

---

### Story 4 — Filtering to Review Food Spending (Sophie)

Halfway through the trip, Sophie wants to see how much the group has spent on food. She clicks the **Food & Drink** filter chip and sees only food-related expenses, with an updated total count and sum. She's reassured the group is within budget.

**Acceptance criteria:**
- Category filter chips narrow the expense list instantly
- Total item count and dollar sum update to match the filter
- All expense categories are available as filter options

---

### Story 5 — Removing a Member Who Cancelled (Maya)

One friend had to cancel the trip last minute. Maya clicks the **delete icon** next to their name in the Members panel to remove them, so they're no longer included in balance calculations or the "Paid by" dropdown.

**Acceptance criteria:**
- Members panel has a delete button per member
- Deleting a member removes them from the expense form's "Paid by" dropdown
- Balances recalculate to reflect the change

---

## 🎨 Design Mockups

The following screenshots are taken from the live deployed application at [tripsplit-gold.vercel.app](https://tripsplit-gold.vercel.app).

### Mockup 1 — Add Expense Form
...
![Add Expense Form](https://github.com/user-attachments/assets/c49bd76e-a57f-4151-882b-e04812196d81)

### Mockup 2 — Expense List with Search & Category Filter
...
![Expense List](https://github.com/user-attachments/assets/499e4dc8-2706-40a8-8d08-e8f8ddc8b70b)

### Mockup 3 — Trip Balances Panel
...
![Trip Balances](https://github.com/user-attachments/assets/b0ce7a55-dd84-4060-b467-336b8311a72b)
---

## 📁 Project Structure

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
│   │   │   └── ...             # Member components (Jianyu)
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── docs/                       # Screenshots for README
├── .eslintrc.json
├── .prettierrc
├── LICENSE
└── README.md
```

---

## 🚀 Instructions to Build

### Prerequisites

- Node.js v18+
- A MongoDB Atlas cluster (free tier works)

### 1. Clone the repository

```bash
git clone https://github.com/klenq/tripsplit.git
cd tripsplit
```

### 2. Configure environment

Create `backend/.env`:

```env
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/
DB_NAME=tripsplit
PORT=5000
```

> ⚠️ Never commit `.env` — it's in `.gitignore`

### 3. Install & run the backend

```bash
cd backend
npm install
npm run dev          # starts Express server on port 5000
```

### 4. Seed the database (optional)

```bash
cd backend
node scripts/seed.js  # inserts 1200+ synthetic expense records
```

### 5. Install & run the frontend

```bash
cd frontend
npm install
npm run dev          # starts Vite dev server on localhost:5173
```

### 6. Open in browser

```
http://localhost:5173
```

---

## 📋 How to Use

1. **Add trip members** using the Add Trip Member panel
2. **Log an expense** — fill in description, amount, date, category, who paid, and who it's split among
3. **View all expenses** — browse the list, filter by category chip, or search by keyword
4. **Edit or delete** any expense using the action buttons on each row
5. **Check balances** — the Trip Balances panel shows who owes what in real time


---

## 🌐 Deployment

Live app: **[https://tripsplit-gold.vercel.app](https://tripsplit-gold.vercel.app)**

Deployed via Vercel with MongoDB Atlas as the cloud database.

---

## 📄 License

[MIT](./LICENSE)
