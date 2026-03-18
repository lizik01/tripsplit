/**
 * Seed script — generates 1000+ synthetic expense records
 * Run: node scripts/seed.js
 */
import { MongoClient } from "mongodb";
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
  "Food & Drink": [
    "Team dinner at local restaurant",
    "Airport lunch",
    "Breakfast at hotel",
    "Street food tour",
    "Grocery run",
    "Coffee and pastries",
    "Rooftop bar drinks",
    "Pizza night",
    "Sushi dinner",
    "Brunch",
  ],
  Transport: [
    "Uber to airport",
    "Train tickets",
    "Bus passes",
    "Car rental deposit",
    "Taxi to hotel",
    "Ferry tickets",
    "Subway day pass",
    "Bike rental",
    "Lyft to venue",
    "Toll fees",
  ],
  Accommodation: [
    "Hotel room night 1",
    "Hotel room night 2",
    "Airbnb deposit",
    "Hostel beds",
    "Resort fee",
    "Hotel breakfast add-on",
    "Late checkout fee",
    "Extra towels/amenities",
  ],
  Activities: [
    "Museum entrance",
    "City tour",
    "Surf lesson",
    "Theme park tickets",
    "Cooking class",
    "Kayak rental",
    "Concert tickets",
    "Spa session",
    "Zip line adventure",
    "Snorkeling tour",
  ],
  Shopping: [
    "Souvenir shopping",
    "Sunscreen and beach gear",
    "Local market haul",
    "Pharmacy supplies",
    "Luggage storage",
  ],
  Other: [
    "Travel insurance",
    "Parking fee",
    "Visa processing",
    "Currency exchange fee",
    "Tip pool",
  ],
};

const NAMES = [
  "Yazi",
  "Jianyu",
  "Alex",
  "Jordan",
  "Sam",
  "Taylor",
  "Morgan",
  "Riley",
];

const TRIP_IDS = [
  "trip_tokyo_2024",
  "trip_paris_2024",
  "trip_bali_2025",
  "trip_nyc_2024",
  "trip_cancun_2025",
];

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

function generateExpenses(count = 1200) {
  const expenses = [];
  const startDate = new Date("2024-01-01");
  const endDate = new Date("2025-03-01");

  for (let i = 0; i < count; i++) {
    const category = randomElement(CATEGORIES);
    const descriptions = DESCRIPTIONS[category];
    const description = randomElement(descriptions);
    const paidBy = randomElement(NAMES);
    const tripId = randomElement(TRIP_IDS);

    // Generate splitAmong — subset of NAMES
    const groupSize = Math.floor(randomBetween(2, NAMES.length + 1));
    const shuffled = [...NAMES].sort(() => 0.5 - Math.random());
    const splitAmong = shuffled.slice(0, groupSize);
    if (!splitAmong.includes(paidBy)) splitAmong.push(paidBy);

    // Realistic amounts per category
    let amount;
    switch (category) {
      case "Accommodation":
        amount = parseFloat(randomBetween(80, 350).toFixed(2));
        break;
      case "Transport":
        amount = parseFloat(randomBetween(5, 120).toFixed(2));
        break;
      case "Food & Drink":
        amount = parseFloat(randomBetween(8, 180).toFixed(2));
        break;
      case "Activities":
        amount = parseFloat(randomBetween(15, 200).toFixed(2));
        break;
      case "Shopping":
        amount = parseFloat(randomBetween(10, 250).toFixed(2));
        break;
      default:
        amount = parseFloat(randomBetween(5, 100).toFixed(2));
    }

    expenses.push({
      description,
      amount,
      paidBy,
      category,
      tripId,
      splitAmong,
      date: randomDate(startDate, endDate),
      createdAt: new Date(),
    });
  }
  return expenses;
}

async function seed() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("expenses");

    // Clear existing synthetic records (keep manually added ones if any)
    await collection.deleteMany({ createdAt: { $exists: true } });

    const expenses = generateExpenses(1200);
    const result = await collection.insertMany(expenses);
    console.log(`✅ Inserted ${result.insertedCount} synthetic expenses`);

    // Create indexes for common queries
    await collection.createIndex({ tripId: 1 });
    await collection.createIndex({ date: -1 });
    await collection.createIndex({ paidBy: 1 });
    console.log("✅ Indexes created");
  } catch (err) {
    console.error("Seed failed:", err);
  } finally {
    await client.close();
  }
}

seed();
