const mongoose = require("mongoose");

const purchaseHistorySchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  amount: { type: Number, required: true },
  carbonSaved: { type: Number, default: 0 },
  plasticSaved: { type: Number, default: 0 },
  treesEquivalent: { type: Number, default: 0 },
  greenCreditsEarned: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    img: { type: String },
    // ─── Existing fields (preserved exactly) ───────────────────────────────
    carbonCreditsPoints: { type: Number, default: 0 },
    points: { type: Number, default: 0 },
    // ─── Phase 1 fields ─────────────────────────────────────────────────────
    greenCredits: { type: Number, default: 0 },
    totalCarbonSaved: { type: Number, default: 0 },
    totalPlasticSaved: { type: Number, default: 0 },
    totalSpend: { type: Number, default: 0 },
    purchaseHistory: [purchaseHistorySchema],
    // ─── Phase 2: Wishlist ──────────────────────────────────────────────────
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
