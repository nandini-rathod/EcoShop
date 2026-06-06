const router = require("express").Router();
const Product = require("../models/Product");
const { calculateCarbonFootprintPercentage } = require("../carobUtils");

// ─── CREATE product ───────────────────────────────────────────────────────────
router.post("/", async (req, res) => {
  const { materials, weight } = req.body;
  try {
    const carbonEmissionPercentage = await calculateCarbonFootprintPercentage(
      materials || [],
      weight || 0
    );
    const newProduct = new Product({ ...req.body, carbonEmissionPercentage });
    const savedProduct = await newProduct.save();
    res.status(200).json(savedProduct);
  } catch (error) {
    res.status(500).json(error);
  }
});

// ─── UPDATE ───────────────────────────────────────────────────────────────────
router.put("/:id", async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id, { $set: req.body }, { new: true }
    );
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json(error);
  }
});

// ─── DELETE ───────────────────────────────────────────────────────────────────
router.delete("/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json("Product has been deleted");
  } catch (error) {
    res.status(500).json(error);
  }
});

// ─── GET single product ───────────────────────────────────────────────────────
router.get("/find/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json(error);
  }
});

// ─── SEARCH  GET /api/products/search?q=hemp&category=women&material=bamboo ──
router.get("/search", async (req, res) => {
  const { q, category, material } = req.query;
  try {
    const conditions = [];
    if (q) {
      const regex = new RegExp(q, "i");
      conditions.push({
        $or: [
          { title: regex },
          { desc: regex },
          { categories: regex },
          { materials: regex },
        ],
      });
    }
    if (category) conditions.push({ categories: { $in: [new RegExp(category, "i")] } });
    if (material) conditions.push({ materials: { $in: [new RegExp(material, "i")] } });

    const query = conditions.length > 0 ? { $and: conditions } : {};
    const products = await Product.find(query).limit(50);
    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json(error);
  }
});

// ─── RELATED  GET /api/products/related/:id ────────────────────────────────
router.get("/related/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json("Product not found");
    const related = await Product.find({
      _id: { $ne: product._id },
      categories: { $in: product.categories },
    }).limit(4);
    res.status(200).json({ products: related });
  } catch (error) {
    res.status(500).json(error);
  }
});

// ─── SHOP BY VALUES  GET /api/products/byvalues?value=low-carbon ─────────────
// values: low-carbon | recycled | plastic-free | organic
router.get("/byvalues", async (req, res) => {
  const { value } = req.query;
  const valueMap = {
    "low-carbon":   { carbonEmissionPercentage: { $lte: 10 } },
    "recycled":     { materials: { $in: [/recycle/i] } },
    "plastic-free": { materials: { $in: [/bamboo/i, /hemp/i, /cotton/i, /linen/i, /glass/i, /steel/i, /cork/i] } },
    "organic":      { materials: { $in: [/organic/i] } },
  };
  try {
    const filter = value && valueMap[value] ? valueMap[value] : {};
    const products = await Product.find(filter);
    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json(error);
  }
});

// ─── GET ALL products ─────────────────────────────────────────────────────────
router.get("/", async (req, res) => {
  const qNew = req.query.new;
  const qCategory = req.query.category;
  try {
    let products;
    if (qNew) {
      products = await Product.find().sort({ createdAt: -1 }).limit(5);
    } else if (qCategory) {
      products = await Product.find({ categories: { $in: [qCategory] } });
    } else {
      products = await Product.find();
    }
    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
