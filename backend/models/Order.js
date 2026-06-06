const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    products: [
      {
        productId: { type: String },
        quantity: { type: Number, default: 1 },
      },
    ],
    amount: {
      type: Number,
      required: true,
    },
    sales: {
      type: Number,
      required: true,
    },
    cost: {
      type: Number,
      required: true,
    },
    address: {
      type: Object,
      required: true,
    },
    status: {
      type: String,
      default: "pending",
    },
    // --- NEW Phase 1 fields ---
    carbonSaved: {
      type: Number,
      default: 0,     // kg CO2 saved vs conventional equivalent
    },
    plasticSaved: {
      type: Number,
      default: 0,     // grams of plastic waste avoided
    },
    treesEquivalent: {
      type: Number,
      default: 0,     // number of tree-days
    },
    greenCreditsEarned: {
      type: Number,
      default: 0,     // credits awarded for this order
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
