const router = require("express").Router();
// const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken")
const Order = require("../models/Order");
const User = require("../models/User");

// ─── Impact calculation helper (mirrors sustainability.js) ───────────────────
function calcImpact(orderAmount) {
  const carbonSaved = parseFloat(((orderAmount / 10) * 0.5).toFixed(3));
  const plasticSaved = parseFloat(((orderAmount / 10) * 15).toFixed(1));
  const treesEquivalent = parseFloat((carbonSaved / 0.0575).toFixed(2));
  const greenCreditsEarned = Math.floor(orderAmount);
  return { carbonSaved, plasticSaved, treesEquivalent, greenCreditsEarned };
}

// ─── CREATE ORDER ─────────────────────────────────────────────────────────────
// verifyToken
router.post("/", async (req, res) => {
  try {
    const impact = calcImpact(req.body.amount || 0);

    const newOrder = new Order({
      ...req.body,
      carbonSaved: impact.carbonSaved,
      plasticSaved: impact.plasticSaved,
      treesEquivalent: impact.treesEquivalent,
      greenCreditsEarned: impact.greenCreditsEarned,
    });

    const savedOrder = await newOrder.save();

    // Update user's sustainability totals asynchronously
    if (req.body.userId) {
      const historyEntry = {
        orderId: savedOrder._id.toString(),
        amount: req.body.amount || 0,
        carbonSaved: impact.carbonSaved,
        plasticSaved: impact.plasticSaved,
        treesEquivalent: impact.treesEquivalent,
        greenCreditsEarned: impact.greenCreditsEarned,
        createdAt: new Date(),
      };

      User.findByIdAndUpdate(
        req.body.userId,
        {
          $inc: {
            greenCredits: impact.greenCreditsEarned,
            carbonCreditsPoints: impact.greenCreditsEarned, // keep existing field in sync
            totalCarbonSaved: impact.carbonSaved,
            totalPlasticSaved: impact.plasticSaved,
            totalSpend: req.body.amount || 0,
          },
          $push: {
            purchaseHistory: {
              $each: [historyEntry],
              $slice: -100, // keep last 100 entries
            },
          },
        },
        { new: false } // don't wait for response to avoid delaying order response
      ).catch((err) => console.error("Failed to update user sustainability data:", err));
    }

    res.status(200).json(savedOrder);
  } catch (error) {
    res.status(500).json(error);
  }
});

// ─── UPDATE ───────────────────────────────────────────────────────────────────
// verifyTokenAndAdmin
router.put("/:id", async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json(error);
  }
});

// ─── DELETE ───────────────────────────────────────────────────────────────────
// verifyTokenAndAdmin
router.delete("/:id", async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json("Order has been deleted");
  } catch (error) {
    res.status(500).json(error);
  }
});

// ─── GET USER ORDERS ──────────────────────────────────────────────────────────
// verifyTokenAndAuthorization
router.get("/find/:userId", async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json(error);
  }
});

// ─── GET ALL ORDERS ───────────────────────────────────────────────────────────
// verifyTokenAndAdmin
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json(error);
  }
});

// ─── GET MONTHLY INCOME ───────────────────────────────────────────────────────
// verifyTokenAndAdmin
router.get("/income", async (req, res) => {
  const productId = req.query.pid;
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(
    new Date(new Date().setMonth(lastMonth.getMonth() - 1))
  );
  try {
    const income = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: previousMonth },
          ...(productId && { products: { $elemMatch: { productId } } }),
        },
      },
      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$amount",
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ]);
    res.status(200).json(income);
  } catch (error) {
    res.status(500).json(error);
  }
});

// ─── GET TOTAL SALES ──────────────────────────────────────────────────────────
router.get("/sales", async (req, res) => {
  try {
    const salesData = await Order.aggregate([
      { $group: { _id: null, totalSales: { $sum: "$amount" } } },
    ]);
    res.status(200).json({ sales: salesData[0]?.totalSales || 0 });
  } catch (error) {
    res.status(500).json(error);
  }
});

// ─── GET TOTAL COST ───────────────────────────────────────────────────────────
router.get("/cost", async (req, res) => {
  try {
    const costData = await Order.aggregate([
      { $group: { _id: null, totalCost: { $sum: "$cost" } } },
    ]);
    res.status(200).json({ cost: costData[0]?.totalCost || 0 });
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
