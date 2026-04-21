/**
 * Seed script — generates synthetic groups, members, and expenses for testing
 * Run: node scripts/seed.js
 */
import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME || "tripsplit";

const CATEGORIES = [
  "Food & Drink",
  "Transport",
  "Accommodation",
  "Activities",
  "Shopping",
  "Other",
];

const DESCRIPTIONS = {
  "Food & Drink": ["Dinner", "Lunch", "Breakfast", "Street food", "Coffee", "Bar tabs"],
  Transport: ["Uber", "Train", "Bus", "Gas", "Flights", "Ferry"],
  Accommodation: ["Hotel", "Airbnb", "Hostel", "Resort fee"],
  Activities: ["Museum", "City tour", "Surf lesson", "Club entry"],
  Shopping: ["Souvenirs", "Sunscreen", "Market haul"],
  Other: ["Travel insurance", "Tip pool"],
};

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function randomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(start, end) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

async function seed() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbName);
    
    // Collections
    const groupsCol = db.collection("groups");
    const membersCol = db.collection("members");
    const expensesCol = db.collection("expenses");

    console.log("Clearing old synthetic data...");
    await groupsCol.deleteMany({ synthetic: true });
    await membersCol.deleteMany({ synthetic: true });
    await expensesCol.deleteMany({ synthetic: true });

    // 1. Create a trip for test_user
    console.log("Seeding data for test_user...");
    const targetGroupId1 = new ObjectId();
    const group1 = {
      _id: targetGroupId1,
      name: "Tahoe Ski Trip 🏂",
      createdBy: "test_user",
      createdAt: new Date(),
      synthetic: true
    };
    await groupsCol.insertOne(group1);

    const members1 = ["test_user", "test_user2", "Alice", "Bob", "Charlie"];
    const membersDocs1 = members1.map(name => ({
      name,
      tripId: targetGroupId1.toString(),
      createdAt: new Date(),
      synthetic: true
    }));
    await membersCol.insertMany(membersDocs1);

    // 2. Create a trip for test_user2
    console.log("Seeding data for test_user2...");
    const targetGroupId2 = new ObjectId();
    const group2 = {
      _id: targetGroupId2,
      name: "Euro Backpacking 🌍",
      createdBy: "test_user2",
      createdAt: new Date(),
      synthetic: true
    };
    await groupsCol.insertOne(group2);

    const members2 = ["test_user2", "test_user", "David", "Eve", "Frank"];
    const membersDocs2 = members2.map(name => ({
      name,
      tripId: targetGroupId2.toString(),
      createdAt: new Date(),
      synthetic: true
    }));
    await membersCol.insertMany(membersDocs2);

    // 3. Generate Expenses for Group 1
    const expenses1 = [];
    for (let i = 0; i < 40; i++) {
      const category = randomElement(CATEGORIES);
      const paidBy = randomElement(members1);
      const splitSize = Math.floor(randomBetween(1, members1.length + 1));
      const splitAmong = [...members1].sort(() => 0.5 - Math.random()).slice(0, splitSize);
      if (!splitAmong.includes(paidBy)) splitAmong.push(paidBy); // ensures payer is part of split usually, but let's be generous

      expenses1.push({
        description: randomElement(DESCRIPTIONS[category]),
        amount: parseFloat(randomBetween(10, 300).toFixed(2)),
        paidBy,
        category,
        tripId: targetGroupId1.toString(),
        splitAmong,
        date: randomDate(new Date("2024-01-01"), new Date("2024-03-01")),
        createdAt: new Date(),
        synthetic: true
      });
    }

    // Add a Settlement/Payment to test_user
    expenses1.push({
      description: "Payment",
      amount: 150.00,
      paidBy: "test_user2",
      category: "Payment",
      tripId: targetGroupId1.toString(),
      splitAmong: ["test_user"], // test_user2 pays test_user
      date: new Date(),
      createdAt: new Date(),
      synthetic: true
    });
    
    await expensesCol.insertMany(expenses1);

    // 4. Generate Expenses for Group 2
    const expenses2 = [];
    for (let i = 0; i < 60; i++) {
      const category = randomElement(CATEGORIES);
      const paidBy = randomElement(members2);
      const splitSize = Math.floor(randomBetween(2, members2.length + 1));
      const splitAmong = [...members2].sort(() => 0.5 - Math.random()).slice(0, splitSize);
      if (!splitAmong.includes(paidBy)) splitAmong.push(paidBy);

      expenses2.push({
        description: randomElement(DESCRIPTIONS[category]),
        amount: parseFloat(randomBetween(5, 500).toFixed(2)),
        paidBy,
        category,
        tripId: targetGroupId2.toString(),
        splitAmong,
        date: randomDate(new Date("2024-05-01"), new Date("2024-08-01")),
        createdAt: new Date(),
        synthetic: true
      });
    }
    await expensesCol.insertMany(expenses2);

    console.log(`✅ Inserted 2 synthetic groups, 10 synthetic members, heavily distributed synthetic expenses for test_user AND test_user2!`);

    await expensesCol.createIndex({ tripId: 1 });
    await expensesCol.createIndex({ date: -1 });
    await expensesCol.createIndex({ paidBy: 1 });
    console.log("✅ Indexes created.");
  } catch (err) {
    console.error("Seed failed:", err);
  } finally {
    await client.close();
  }
}

seed();
