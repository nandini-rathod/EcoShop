const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");

// ─── UPDATE user ──────────────────────────────────────────────────────────────
router.put("/:id", async (req, res) => {
  if (req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString();
  }
  try {
    const updateUser = await User.findByIdAndUpdate(
      req.params.id, { $set: req.body }, { new: true }
    );
    res.status(200).json(updateUser);
  } catch (error) {
    res.status(500).json(error);
  }
});

// ─── DELETE user ──────────────────────────────────────────────────────────────
router.delete("/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("The user has been deleted");
  } catch (error) {
    res.status(500).json(error);
  }
});

// ─── GET single user ──────────────────────────────────────────────────────────
router.get("/find/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...others } = user._doc;
    res.status(200).json({ ...others });
  } catch (error) {
    res.status(500).json(error);
  }
});

// ─── GET all users ────────────────────────────────────────────────────────────
router.get("/", async (req, res) => {
  const query = req.query.new;
  try {
    const users = query
      ? await User.find().sort({ _id: -1 }).limit(5)
      : await User.find();
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json(error);
  }
});

// ─── GET user stats ───────────────────────────────────────────────────────────
router.get("/stats", async (req, res) => {
  const date = new Date();
  const lastyear = new Date(date.setFullYear(date.getFullYear() - 1));
  try {
    const data = await User.aggregate([
      { $match: { createdAt: { $gte: lastyear } } },
      { $project: { month: { $month: "$createdAt" } } },
      { $group: { _id: "$month", total: { $sum: 1 } } },
    ]);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json(error);
  }
});

// ─── WISHLIST: GET /api/users/:id/wishlist ────────────────────────────────────
router.get("/:id/wishlist", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("wishlist");
    if (!user) return res.status(404).json("User not found");
    res.status(200).json({ wishlist: user.wishlist });
  } catch (error) {
    res.status(500).json(error);
  }
});

// ─── WISHLIST: POST /api/users/:id/wishlist  { productId } ───────────────────
router.post("/:id/wishlist", async (req, res) => {
  const { productId } = req.body;
  if (!productId) return res.status(400).json("productId required");
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { wishlist: productId } },
      { new: true }
    ).populate("wishlist");
    res.status(200).json({ wishlist: user.wishlist });
  } catch (error) {
    res.status(500).json(error);
  }
});

// ─── WISHLIST: DELETE /api/users/:id/wishlist/:productId ─────────────────────
router.delete("/:id/wishlist/:productId", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $pull: { wishlist: req.params.productId } },
      { new: true }
    ).populate("wishlist");
    res.status(200).json({ wishlist: user.wishlist });
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
