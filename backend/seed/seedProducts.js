/**
 * EcoShop Product Seeder — 20 eco-friendly products across 6 categories
 * Usage: node seed/seedProducts.js
 */
require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("../models/Product");

const PRODUCTS = [
  // ── WOMEN ──────────────────────────────────────────────────────────────────
  {
    title: "Organic Cotton T-Shirt",
    desc: "Soft GOTS-certified organic cotton tee. Breathable, durable, and grown without synthetic pesticides. A wardrobe staple with zero compromise.",
    img: "https://images.pexels.com/photos/4066293/pexels-photo-4066293.jpeg?auto=compress&w=600",
    categories: ["women", "tops"],
    size: ["XS","S","M","L","XL"],
    color: ["white","sage","black","terracotta"],
    price: 34.99, weight: 180, inStock: true,
    materials: ["organic cotton"],
    carbonEmissionPercentage: 5,
  },
  {
    title: "Hemp Hoodie",
    desc: "Cozy hoodie made from 55% hemp and 45% organic cotton blend. Hemp requires no pesticides and uses 50% less water than conventional cotton.",
    img: "https://images.pexels.com/photos/6311392/pexels-photo-6311392.jpeg?auto=compress&w=600",
    categories: ["women", "tops"],
    size: ["XS","S","M","L","XL"],
    color: ["oatmeal","forest","charcoal"],
    price: 79.99, weight: 450, inStock: true,
    materials: ["hemp", "organic cotton"],
    carbonEmissionPercentage: 6,
  },
  {
    title: "Bamboo Leggings",
    desc: "Ultra-soft bamboo viscose leggings with 4-way stretch. Naturally moisture-wicking, antibacterial, and incredibly comfortable for all-day wear.",
    img: "https://images.pexels.com/photos/6311474/pexels-photo-6311474.jpeg?auto=compress&w=600",
    categories: ["women", "bottoms"],
    size: ["XS","S","M","L","XL"],
    color: ["black","navy","olive"],
    price: 54.99, weight: 200, inStock: true,
    materials: ["bamboo"],
    carbonEmissionPercentage: 4,
  },
  {
    title: "Recycled Denim Jacket",
    desc: "Classic jacket crafted from 100% post-consumer recycled denim. Each piece diverts approximately 1.5 kg of textile waste from landfill.",
    img: "https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&w=600",
    categories: ["women", "outerwear"],
    size: ["XS","S","M","L","XL"],
    color: ["light-wash","dark-wash"],
    price: 109.99, weight: 700, inStock: true,
    materials: ["recycled cotton"],
    carbonEmissionPercentage: 12,
  },
  // ── MEN ────────────────────────────────────────────────────────────────────
  {
    title: "Organic Polo Shirt",
    desc: "Classic polo in GOTS-certified organic piqué cotton. Timeless style with a clean conscience — no synthetic dyes, no harmful chemicals.",
    img: "https://images.pexels.com/photos/7680201/pexels-photo-7680201.jpeg?auto=compress&w=600",
    categories: ["men", "tops"],
    size: ["S","M","L","XL","XXL"],
    color: ["white","navy","forest"],
    price: 44.99, weight: 220, inStock: true,
    materials: ["organic cotton"],
    carbonEmissionPercentage: 5,
  },
  {
    title: "Recycled Joggers",
    desc: "Comfortable joggers made from recycled plastic bottles (rPET). Each pair uses approximately 12 plastic bottles that would otherwise end up in the ocean.",
    img: "https://images.pexels.com/photos/6311600/pexels-photo-6311600.jpeg?auto=compress&w=600",
    categories: ["men", "bottoms"],
    size: ["S","M","L","XL","XXL"],
    color: ["charcoal","navy","olive"],
    price: 64.99, weight: 380, inStock: true,
    materials: ["recycled polyester"],
    carbonEmissionPercentage: 8,
  },
  {
    title: "Hemp Shirt",
    desc: "Lightweight woven shirt in 100% hemp fabric. Gets softer with every wash, naturally UV-resistant, and grows with minimal environmental impact.",
    img: "https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?auto=compress&w=600",
    categories: ["men", "tops"],
    size: ["S","M","L","XL","XXL"],
    color: ["natural","blue","olive"],
    price: 59.99, weight: 250, inStock: true,
    materials: ["hemp"],
    carbonEmissionPercentage: 4,
  },
  {
    title: "Bamboo Socks (3-Pack)",
    desc: "Luxuriously soft bamboo socks — naturally odour-resistant and temperature-regulating. Pack of 3 pairs, plastic-free packaging.",
    img: "https://images.pexels.com/photos/6311648/pexels-photo-6311648.jpeg?auto=compress&w=600",
    categories: ["men", "accessories"],
    size: ["S","M","L"],
    color: ["natural","charcoal","navy"],
    price: 19.99, weight: 120, inStock: true,
    materials: ["bamboo"],
    carbonEmissionPercentage: 3,
  },
  // ── HOME ───────────────────────────────────────────────────────────────────
  {
    title: "Bamboo Toothbrush Set",
    desc: "Set of 4 bamboo toothbrushes with BPA-free bristles. Biodegradable handles replace 4 plastic toothbrushes that would take 400 years to decompose.",
    img: "https://images.pexels.com/photos/4465129/pexels-photo-4465129.jpeg?auto=compress&w=600",
    categories: ["home", "bathroom"],
    size: ["standard"],
    color: ["natural"],
    price: 12.99, weight: 80, inStock: true,
    materials: ["bamboo"],
    carbonEmissionPercentage: 2,
  },
  {
    title: "Reusable Beeswax Wraps",
    desc: "Set of 3 beeswax-coated cotton food wraps. Replace hundreds of metres of single-use cling film. Washable, reusable for up to a year.",
    img: "https://images.pexels.com/photos/5632394/pexels-photo-5632394.jpeg?auto=compress&w=600",
    categories: ["home", "kitchen"],
    size: ["S","M","L"],
    color: ["assorted"],
    price: 18.99, weight: 150, inStock: true,
    materials: ["organic cotton"],
    carbonEmissionPercentage: 3,
  },
  {
    title: "Eco Laundry Detergent",
    desc: "Plant-based concentrated laundry powder in compostable packaging. 60 washes per pack, free from phosphates, optical brighteners, and synthetic fragrances.",
    img: "https://images.pexels.com/photos/4239091/pexels-photo-4239091.jpeg?auto=compress&w=600",
    categories: ["home", "cleaning"],
    size: ["1kg","2kg"],
    color: ["n/a"],
    price: 14.99, weight: 1000, inStock: true,
    materials: ["plant-based"],
    carbonEmissionPercentage: 2,
  },
  {
    title: "Recycled Storage Basket",
    desc: "Woven storage basket made from recycled cotton rope. Sturdy, stylish, and keeps textiles out of landfill. Perfect for towels, toys, or plants.",
    img: "https://images.pexels.com/photos/4846096/pexels-photo-4846096.jpeg?auto=compress&w=600",
    categories: ["home", "storage"],
    size: ["S","M","L"],
    color: ["natural","grey","terracotta"],
    price: 29.99, weight: 500, inStock: true,
    materials: ["recycled cotton"],
    carbonEmissionPercentage: 7,
  },
  // ── KITCHEN ────────────────────────────────────────────────────────────────
  {
    title: "Bamboo Cutlery Set",
    desc: "Portable bamboo cutlery set: fork, knife, spoon, chopsticks, and cleaning brush in a cotton pouch. The perfect zero-waste alternative to disposable plastic cutlery.",
    img: "https://images.pexels.com/photos/5677796/pexels-photo-5677796.jpeg?auto=compress&w=600",
    categories: ["kitchen", "accessories"],
    size: ["standard"],
    color: ["natural"],
    price: 15.99, weight: 100, inStock: true,
    materials: ["bamboo"],
    carbonEmissionPercentage: 2,
  },
  {
    title: "Reusable Steel Straw Kit",
    desc: "Set of 6 stainless steel straws in varying sizes with 2 cleaning brushes and a cotton pouch. Say goodbye to single-use plastic straws forever.",
    img: "https://images.pexels.com/photos/5677718/pexels-photo-5677718.jpeg?auto=compress&w=600",
    categories: ["kitchen", "accessories"],
    size: ["standard"],
    color: ["silver","rose-gold"],
    price: 13.99, weight: 120, inStock: true,
    materials: ["stainless steel"],
    carbonEmissionPercentage: 3,
  },
  {
    title: "Glass Food Containers (Set of 3)",
    desc: "Borosilicate glass food containers with bamboo lids. Microwave, oven, and dishwasher safe. Replaces plastic tupperware for a lifetime of use.",
    img: "https://images.pexels.com/photos/4397919/pexels-photo-4397919.jpeg?auto=compress&w=600",
    categories: ["kitchen", "storage"],
    size: ["S","M","L"],
    color: ["clear"],
    price: 42.99, weight: 1200, inStock: true,
    materials: ["glass", "bamboo"],
    carbonEmissionPercentage: 6,
  },
  {
    title: "Compost Bin",
    desc: "Compact countertop compost bin made from recycled stainless steel. Carbon filter lid eliminates odours. Diverts food waste from landfill effortlessly.",
    img: "https://images.pexels.com/photos/5273022/pexels-photo-5273022.jpeg?auto=compress&w=600",
    categories: ["kitchen", "home"],
    size: ["2L","5L"],
    color: ["silver","matte-black"],
    price: 34.99, weight: 800, inStock: true,
    materials: ["recycled stainless steel"],
    carbonEmissionPercentage: 5,
  },
  // ── WELLNESS ───────────────────────────────────────────────────────────────
  {
    title: "Hemp Yoga Mat",
    desc: "Non-slip yoga mat made from natural hemp fibre with a natural rubber base. Biodegradable, free from PVC and toxic foaming agents. Ideal for all yoga styles.",
    img: "https://images.pexels.com/photos/4498482/pexels-photo-4498482.jpeg?auto=compress&w=600",
    categories: ["wellness", "sports"],
    size: ["standard"],
    color: ["natural"],
    price: 74.99, weight: 1500, inStock: true,
    materials: ["hemp"],
    carbonEmissionPercentage: 6,
  },
  {
    title: "Cork Yoga Block",
    desc: "Sustainably harvested cork yoga block. Naturally antimicrobial, provides perfect grip and support. Cork forests actively absorb CO₂ — buying cork helps preserve them.",
    img: "https://images.pexels.com/photos/4498151/pexels-photo-4498151.jpeg?auto=compress&w=600",
    categories: ["wellness", "sports"],
    size: ["standard"],
    color: ["natural"],
    price: 24.99, weight: 350, inStock: true,
    materials: ["cork"],
    carbonEmissionPercentage: 2,
  },
  // ── ACCESSORIES ────────────────────────────────────────────────────────────
  {
    title: "Organic Cotton Tote Bag",
    desc: "100% GOTS-certified organic cotton tote with long handles. Sturdy enough for groceries, stylish enough for everyday use. Natural dyes, plastic-free packaging.",
    img: "https://images.pexels.com/photos/5632390/pexels-photo-5632390.jpeg?auto=compress&w=600",
    categories: ["accessories", "bags"],
    size: ["standard"],
    color: ["natural","black","sage"],
    price: 22.99, weight: 200, inStock: true,
    materials: ["organic cotton"],
    carbonEmissionPercentage: 4,
  },
  {
    title: "Recycled Backpack",
    desc: "20L everyday backpack made from 100% recycled PET bottles. Water-resistant, padded laptop sleeve, multiple pockets. Equivalent to recycling 28 plastic bottles.",
    img: "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&w=600",
    categories: ["accessories", "bags"],
    size: ["20L"],
    color: ["charcoal","forest","navy"],
    price: 94.99, weight: 650, inStock: true,
    materials: ["recycled polyester"],
    carbonEmissionPercentage: 9,
  },
];

async function seed() {
  console.log("🌱 Connecting to MongoDB...");
  await mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log("✅ Connected\n🛍️  Seeding 20 eco products...");
  let created = 0, updated = 0;
  for (const prod of PRODUCTS) {
    const result = await Product.findOneAndUpdate(
      { title: prod.title }, prod, { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    if (result.createdAt?.getTime() === result.updatedAt?.getTime()) created++;
    else updated++;
  }
  console.log(`✓ ${created} created, ${updated} updated`);
  console.log("✅ Product seed complete!");
  await mongoose.disconnect();
}

seed().catch((err) => { console.error("❌ Seed failed:", err); process.exit(1); });
