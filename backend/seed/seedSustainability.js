/**
 * Phase 1 Seed Script
 * Seeds test users, products, materials, and orders with sustainability data.
 *
 * Usage:
 *   cd Sustainable-Select-backend
 *   node seed/seedSustainability.js
 */

require("dotenv").config();
const mongoose = require("mongoose");
const CryptoJS = require("crypto-js");

// ─── Models ──────────────────────────────────────────────────────────────────
const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const Material = require("../models/Material");

// ─── Impact helper (same formula as routes) ──────────────────────────────────
function calcImpact(amount) {
  const carbonSaved = parseFloat(((amount / 10) * 0.5).toFixed(3));
  const plasticSaved = parseFloat(((amount / 10) * 15).toFixed(1));
  const treesEquivalent = parseFloat((carbonSaved / 0.0575).toFixed(2));
  const greenCreditsEarned = Math.floor(amount);
  return { carbonSaved, plasticSaved, treesEquivalent, greenCreditsEarned };
}

// ─── Seed data ────────────────────────────────────────────────────────────────
const MATERIALS_SEED = [
  { name: "organic cotton", carbonFootprint: 2.1 },
  { name: "recycled polyester", carbonFootprint: 3.2 },
  { name: "bamboo", carbonFootprint: 1.4 },
  { name: "hemp", carbonFootprint: 0.9 },
  { name: "wool", carbonFootprint: 5.0 },
  { name: "linen", carbonFootprint: 1.7 },
  { name: "recycled nylon", carbonFootprint: 2.8 },
  { name: "tencel", carbonFootprint: 1.8 },
];

const PRODUCTS_SEED = [
  {
    title: "Organic Cotton Tote Bag",
    desc: "100% organic cotton, reusable shopping bag with natural dye.",
    img: "https://images.pexels.com/photos/5632390/pexels-photo-5632390.jpeg",
    categories: ["bags", "accessories"],
    size: ["S", "M", "L"],
    color: ["natural", "sage"],
    price: 24.99,
    weight: 200,
    inStock: true,
    materials: ["organic cotton"],
    carbonEmissionPercentage: 12,
  },
  {
    title: "Bamboo Water Bottle",
    desc: "Double-wall insulated bottle with bamboo exterior.",
    img: "https://images.pexels.com/photos/4000003/pexels-photo-4000003.jpeg",
    categories: ["home", "kitchen"],
    size: ["500ml", "750ml"],
    color: ["natural", "charcoal"],
    price: 34.99,
    weight: 350,
    inStock: true,
    materials: ["bamboo"],
    carbonEmissionPercentage: 8,
  },
  {
    title: "Recycled Polyester Jacket",
    desc: "Made from 100% post-consumer recycled plastic bottles.",
    img: "https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg",
    categories: ["women", "outerwear"],
    size: ["XS", "S", "M", "L", "XL"],
    color: ["forest", "navy", "charcoal"],
    price: 89.99,
    weight: 600,
    inStock: true,
    materials: ["recycled polyester"],
    carbonEmissionPercentage: 18,
  },
  {
    title: "Hemp Yoga Mat",
    desc: "Natural hemp yoga mat, non-toxic and biodegradable.",
    img: "https://images.pexels.com/photos/4498482/pexels-photo-4498482.jpeg",
    categories: ["sports", "wellness"],
    size: ["standard"],
    color: ["natural"],
    price: 69.99,
    weight: 1200,
    inStock: true,
    materials: ["hemp"],
    carbonEmissionPercentage: 6,
  },
];

// ─── Past order generator ────────────────────────────────────────────────────
function generatePastOrder(userId, productIds, monthsAgo, amount) {
  const date = new Date();
  date.setMonth(date.getMonth() - monthsAgo);
  const impact = calcImpact(amount);

  const historyEntry = {
    orderId: new mongoose.Types.ObjectId().toString(),
    amount,
    ...impact,
    createdAt: date,
  };

  const order = {
    userId,
    products: [{ productId: productIds[Math.floor(Math.random() * productIds.length)], quantity: 1 }],
    amount,
    sales: amount,
    cost: amount * 0.6,
    address: { street: "123 Eco Lane", city: "Green City", country: "US" },
    status: "delivered",
    ...impact,
    createdAt: date,
    updatedAt: date,
  };

  return { order, historyEntry };
}

// ─── Main seed function ───────────────────────────────────────────────────────
async function seed() {
  console.log("🌱 Connecting to MongoDB...");
  await mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("✅ Connected");

  // ── Materials ──
  console.log("\n📦 Seeding materials...");
  for (const mat of MATERIALS_SEED) {
    await Material.findOneAndUpdate(
      { name: mat.name },
      mat,
      { upsert: true, new: true }
    );
  }
  console.log(`  ✓ ${MATERIALS_SEED.length} materials upserted`);

  // ── Products ──
  console.log("\n🛍️  Seeding eco products...");
  const savedProducts = [];
  for (const prod of PRODUCTS_SEED) {
    const saved = await Product.findOneAndUpdate(
      { title: prod.title },
      prod,
      { upsert: true, new: true }
    );
    savedProducts.push(saved);
  }
  console.log(`  ✓ ${savedProducts.length} products upserted`);
  const productIds = savedProducts.map((p) => p._id.toString());

  // ── Test Users ──
  console.log("\n👤 Seeding test users...");
  const testUsers = [
    {
      username: "ecoshop_user",
      email: "user@ecoshop.com",
      password: "password123",
      isAdmin: false,
    },
    {
      username: "green_admin",
      email: "admin@ecoshop.com",
      password: "admin123",
      isAdmin: true,
    },
  ];

  const savedUsers = [];
  for (const u of testUsers) {
    const existing = await User.findOne({ username: u.username });
    if (!existing) {
      const encryptedPw = CryptoJS.AES.encrypt(u.password, process.env.PASS_SEC).toString();
      const newUser = await User.create({
        ...u,
        password: encryptedPw,
        greenCredits: 0,
        totalCarbonSaved: 0,
        totalPlasticSaved: 0,
        totalSpend: 0,
        purchaseHistory: [],
      });
      savedUsers.push(newUser);
      console.log(`  ✓ Created user: ${u.username} (password: ${u.password})`);
    } else {
      savedUsers.push(existing);
      console.log(`  ℹ️  User exists: ${u.username}`);
    }
  }

  // ── Historical Orders (for the eco user) ──
  const ecoUser = savedUsers[0];
  console.log(`\n📋 Seeding historical orders for ${ecoUser.username}...`);

  // Generate 12 months of orders
  const orderAmounts = [29.99, 89.99, 24.99, 69.99, 34.99, 89.99, 49.99, 24.99, 89.99, 69.99, 34.99, 24.99];
  let totalCarbonSaved = 0;
  let totalPlasticSaved = 0;
  let totalGreenCredits = 0;
  let totalSpend = 0;
  const allHistoryEntries = [];

  for (let i = 0; i < orderAmounts.length; i++) {
    const { order, historyEntry } = generatePastOrder(
      ecoUser._id.toString(),
      productIds,
      11 - i, // 11 months ago → last month
      orderAmounts[i]
    );

    await Order.create(order);

    totalCarbonSaved += order.carbonSaved;
    totalPlasticSaved += order.plasticSaved;
    totalGreenCredits += order.greenCreditsEarned;
    totalSpend += order.amount;
    allHistoryEntries.push({ ...historyEntry, orderId: order._id?.toString() || historyEntry.orderId });
  }

  // Update user totals
  await User.findByIdAndUpdate(ecoUser._id, {
    greenCredits: totalGreenCredits,
    carbonCreditsPoints: totalGreenCredits,
    totalCarbonSaved: parseFloat(totalCarbonSaved.toFixed(3)),
    totalPlasticSaved: parseFloat(totalPlasticSaved.toFixed(1)),
    totalSpend: parseFloat(totalSpend.toFixed(2)),
    purchaseHistory: allHistoryEntries,
  });

  console.log(`  ✓ 12 historical orders created`);
  console.log(`  ✓ User totals: greenCredits=${totalGreenCredits}, CO2=${totalCarbonSaved.toFixed(2)}kg`);

  console.log("\n✅ Phase 1 seed complete!");
  console.log("\n📌 Test credentials:");
  console.log("   Customer: username=ecoshop_user  password=password123");
  console.log("   Admin:    username=green_admin   password=admin123");
  console.log("\n🌿 Dashboard available at: http://localhost:3000/dashboard");
  console.log("🌿 Admin sustainability:   http://localhost:3001/sustainability");

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
