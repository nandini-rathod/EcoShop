/**
 * /api/sustainability  — all existing endpoints preserved + eco-impact preview
 */
const router = require("express").Router();
const User = require("../models/User");
const Order = require("../models/Order");

function calcImpact(orderAmount) {
  const carbonSaved     = parseFloat(((orderAmount / 10) * 0.5).toFixed(3));
  const plasticSaved    = parseFloat(((orderAmount / 10) * 15).toFixed(1));
  const treesEquivalent = parseFloat((carbonSaved / 0.0575).toFixed(2));
  const greenCreditsEarned = Math.floor(orderAmount);
  return { carbonSaved, plasticSaved, treesEquivalent, greenCreditsEarned };
}

// ─── EXISTING: GET /dashboard/:userId ────────────────────────────────────────
router.get("/dashboard/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json("User not found");
    const orders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    const totalOrders    = orders.length;
    const totalSpend     = orders.reduce((s, o) => s + (o.amount || 0), 0);
    const greenCredits   = user.greenCredits || 0;
    const totalCarbonSaved  = user.totalCarbonSaved || 0;
    const totalPlasticSaved = user.totalPlasticSaved || 0;
    const treesEquivalent   = parseFloat((totalCarbonSaved / 0.0575).toFixed(2));
    const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const monthlyMap = {};
    orders.forEach((order) => {
      const d = new Date(order.createdAt);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      if (!monthlyMap[key]) {
        monthlyMap[key] = { name: MONTHS[d.getMonth()], year: d.getFullYear(), month: d.getMonth(), spend: 0, carbonSaved: 0, greenCredits: 0, orders: 0 };
      }
      monthlyMap[key].spend        += order.amount || 0;
      monthlyMap[key].carbonSaved  += order.carbonSaved || 0;
      monthlyMap[key].greenCredits += order.greenCreditsEarned || 0;
      monthlyMap[key].orders       += 1;
    });
    const monthlyData = Object.values(monthlyMap)
      .sort((a, b) => a.year - b.year || a.month - b.month)
      .slice(-12)
      .map(({ name, spend, carbonSaved, greenCredits, orders }) => ({
        name,
        spend: parseFloat(spend.toFixed(2)),
        "CO₂ Saved (kg)": parseFloat(carbonSaved.toFixed(3)),
        "Green Credits": greenCredits,
        orders,
      }));
    const purchaseHistory = (user.purchaseHistory || []).slice(-10).reverse().map((p) => ({
      orderId: p.orderId, amount: p.amount, carbonSaved: p.carbonSaved,
      plasticSaved: p.plasticSaved, treesEquivalent: p.treesEquivalent,
      greenCreditsEarned: p.greenCreditsEarned, date: p.createdAt,
    }));
    res.status(200).json({ totalOrders, totalSpend: parseFloat(totalSpend.toFixed(2)), greenCredits, totalCarbonSaved: parseFloat(totalCarbonSaved.toFixed(3)), totalPlasticSaved: parseFloat(totalPlasticSaved.toFixed(1)), treesEquivalent, monthlyData, purchaseHistory });
  } catch (error) {
    res.status(500).json(error);
  }
});

// ─── EXISTING: GET /credits/:userId ──────────────────────────────────────────
router.get("/credits/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json("User not found");
    res.status(200).json({
      greenCredits: user.greenCredits || 0,
      carbonCreditsPoints: user.carbonCreditsPoints || 0,
      points: user.points || 0,
      purchaseHistory: (user.purchaseHistory || []).slice(-20).reverse(),
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

// ─── EXISTING: POST /redeem/:userId ──────────────────────────────────────────
router.post("/redeem/:userId", async (req, res) => {
  try {
    const { credits } = req.body;
    if (!credits || credits <= 0) return res.status(400).json("Invalid redemption amount");
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json("User not found");
    if ((user.greenCredits || 0) < credits) return res.status(400).json("Insufficient green credits");
    const updated = await User.findByIdAndUpdate(req.params.userId, { $inc: { greenCredits: -credits } }, { new: true });
    res.status(200).json({ success: true, greenCreditsRemaining: updated.greenCredits, message: `Successfully redeemed ${credits} Green Credits!` });
  } catch (error) {
    res.status(500).json(error);
  }
});

// ─── EXISTING: GET /carbon/:userId ───────────────────────────────────────────
router.get("/carbon/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json("User not found");
    const orders = await Order.find({ userId: req.params.userId, carbonSaved: { $gt: 0 } }).sort({ createdAt: -1 }).limit(20);
    res.status(200).json({
      totalCarbonSaved: user.totalCarbonSaved || 0,
      totalPlasticSaved: user.totalPlasticSaved || 0,
      treesEquivalent: parseFloat(((user.totalCarbonSaved || 0) / 0.0575).toFixed(2)),
      impactHistory: orders.map((o) => ({ orderId: o._id, date: o.createdAt, amount: o.amount, carbonSaved: o.carbonSaved, plasticSaved: o.plasticSaved, treesEquivalent: o.treesEquivalent })),
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

// ─── EXISTING: GET /monthly/:userId ──────────────────────────────────────────
router.get("/monthly/:userId", async (req, res) => {
  try {
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);
    twelveMonthsAgo.setDate(1);
    const data = await Order.aggregate([
      { $match: { userId: req.params.userId, createdAt: { $gte: twelveMonthsAgo } } },
      { $group: { _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } }, totalSpend: { $sum: "$amount" }, totalCarbon: { $sum: "$carbonSaved" }, totalCredits: { $sum: "$greenCreditsEarned" }, orderCount: { $sum: 1 } } },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);
    const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    res.status(200).json(data.map((d) => ({ name: MONTHS[d._id.month - 1], spend: parseFloat(d.totalSpend.toFixed(2)), "CO₂ Saved (kg)": parseFloat(d.totalCarbon.toFixed(3)), "Green Credits": d.totalCredits, orders: d.orderCount })));
  } catch (error) {
    res.status(500).json(error);
  }
});

// ─── EXISTING: GET /admin/overview ───────────────────────────────────────────
router.get("/admin/overview", async (req, res) => {
  try {
    const [userStats] = await User.aggregate([{ $group: { _id: null, totalUsers: { $sum: 1 }, totalGreenCreditsIssued: { $sum: "$greenCredits" }, totalCarbonSavedPlatform: { $sum: "$totalCarbonSaved" }, totalPlasticSavedPlatform: { $sum: "$totalPlasticSaved" } } }]);
    const [orderStats] = await Order.aggregate([{ $group: { _id: null, totalOrders: { $sum: 1 }, totalRevenue: { $sum: "$amount" }, totalCarbonSaved: { $sum: "$carbonSaved" }, totalPlasticSaved: { $sum: "$plasticSaved" }, totalCreditsIssued: { $sum: "$greenCreditsEarned" } } }]);
    const sixMonthsAgo = new Date(); sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5); sixMonthsAgo.setDate(1);
    const monthlyTrend = await Order.aggregate([{ $match: { createdAt: { $gte: sixMonthsAgo } } }, { $group: { _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } }, carbonSaved: { $sum: "$carbonSaved" }, revenue: { $sum: "$amount" }, orders: { $sum: 1 } } }, { $sort: { "_id.year": 1, "_id.month": 1 } }]);
    const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    res.status(200).json({ users: userStats || {}, orders: orderStats || {}, monthlyTrend: monthlyTrend.map((d) => ({ name: MONTHS[d._id.month - 1], "CO₂ Saved (kg)": parseFloat(d.carbonSaved.toFixed(2)), Revenue: parseFloat(d.revenue.toFixed(2)), Orders: d.orders })) });
  } catch (error) {
    res.status(500).json(error);
  }
});

// ─── NEW: GET /preview?amount=99.99 ─ eco impact preview BEFORE purchase ─────
router.get("/preview", (req, res) => {
  const amount = parseFloat(req.query.amount) || 0;
  res.status(200).json(calcImpact(amount));
});

module.exports = router;
