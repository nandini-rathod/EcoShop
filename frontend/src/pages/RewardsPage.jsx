import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { publicRequest } from "../requestMethods";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const TIERS = [
  { credits: 50,  discount: 5,  label: "Seedling",   emoji: "🌱", color: "#4caf50" },
  { credits: 100, discount: 12, label: "Sapling",     emoji: "🌿", color: "#2e7d32" },
  { credits: 200, discount: 30, label: "Eco Guardian",emoji: "🌳", color: "#1a5c38" },
];

const ACHIEVEMENTS = [
  { id: "first_order",   emoji: "🛍️",  title: "First Eco Purchase",   desc: "Made your first sustainable purchase",          threshold: 1 },
  { id: "carbon_10",     emoji: "🌿",  title: "Carbon Cutter",         desc: "Saved 10+ kg of CO₂",                         threshold: 10 },
  { id: "spender_100",   emoji: "💚",  title: "Green Spender",         desc: "Spent $100+ on eco-friendly products",         threshold: 100 },
  { id: "credits_50",    emoji: "✦",   title: "Credit Collector",      desc: "Earned 50+ Green Credits",                    threshold: 50 },
  { id: "plastic_500",   emoji: "♻️",  title: "Plastic Fighter",       desc: "Avoided 500g+ of plastic waste",              threshold: 500 },
];

const StatBox = ({ emoji, label, value, unit, color }) => (
  <div style={{
    background: "white", borderRadius: 12, padding: "20px 24px", flex: 1, minWidth: 140,
    boxShadow: "0 2px 12px rgba(0,0,0,0.06)", borderTop: `4px solid ${color}`,
    textAlign: "center",
  }}>
    <div style={{ fontSize: 28, marginBottom: 4 }}>{emoji}</div>
    <div style={{ fontSize: 22, fontWeight: 700, color }}>{value} <span style={{ fontSize: 14, color: "#888" }}>{unit}</span></div>
    <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>{label}</div>
  </div>
);

const RewardsPage = () => {
  const currentUser = useSelector((s) => s.user.currentUser);
  const history     = useHistory();
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [redeemAmt, setRedeemAmt]   = useState("");
  const [redeemMsg, setRedeemMsg]   = useState(null);
  const [redeemLoading, setRedeemLoading] = useState(false);

  useEffect(() => {
    if (!currentUser) { history.push("/login"); return; }
    const userId = currentUser._id || currentUser.id;
    setLoading(true);
    publicRequest
      .get(`/sustainability/dashboard/${userId}`)
      .then((res) => setData(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [currentUser, history]);

  const handleRedeem = async () => {
    const amount = parseInt(redeemAmt, 10);
    if (!amount || amount <= 0 || amount > (data?.greenCredits || 0)) return;
    setRedeemLoading(true);
    setRedeemMsg(null);
    const userId = currentUser._id || currentUser.id;
    try {
      const res = await publicRequest.post(`/sustainability/redeem/${userId}`, { credits: amount });
      setData((prev) => ({ ...prev, greenCredits: res.data.greenCreditsRemaining }));
      setRedeemMsg({ type: "success", text: res.data.message });
      setRedeemAmt("");
    } catch (err) {
      setRedeemMsg({ type: "error", text: err.response?.data || "Redemption failed" });
    } finally {
      setRedeemLoading(false);
    }
  };

  const greenCredits   = data?.greenCredits || 0;
  const totalSpend     = data?.totalSpend || 0;
  const totalCarbon    = data?.totalCarbonSaved || 0;
  const totalPlastic   = data?.totalPlasticSaved || 0;
  const totalOrders    = data?.totalOrders || 0;

  const nextTier = TIERS.find((t) => t.credits > greenCredits);
  const progressPct = nextTier
    ? Math.min(100, Math.round((greenCredits / nextTier.credits) * 100))
    : 100;

  return (
    <div style={{ background: "#f5faf6", minHeight: "100vh" }}>
      <Navbar />

      {/* ── Hero ── */}
      <div style={{
        background: "linear-gradient(135deg, #1a3d2b 0%, #2d8c5e 100%)",
        padding: "48px 24px 36px", textAlign: "center", color: "white",
      }}>
        <div style={{ fontSize: 48, marginBottom: 8 }}>✦</div>
        <h1 style={{ margin: "0 0 8px", fontSize: 32, fontWeight: 800 }}>Green Credits & Rewards</h1>
        <p style={{ margin: 0, opacity: 0.85, fontSize: 16 }}>
          Earn credits with every eco-friendly purchase. Redeem for real discounts.
        </p>
        {!currentUser && (
          <Link to="/login">
            <button style={{ marginTop: 20, padding: "12px 28px", background: "#e0f7a2", color: "#1a3d2b", border: "none", borderRadius: 25, fontWeight: 700, cursor: "pointer", fontSize: 15 }}>
              Login to View Your Credits
            </button>
          </Link>
        )}
        {currentUser && !loading && (
          <div style={{ marginTop: 20, display: "inline-block", background: "rgba(255,255,255,0.15)", borderRadius: 16, padding: "16px 32px" }}>
            <div style={{ fontSize: 42, fontWeight: 800, letterSpacing: -1 }}>
              ✦ {greenCredits}
            </div>
            <div style={{ fontSize: 14, opacity: 0.9 }}>Your Green Credits Balance</div>
          </div>
        )}
      </div>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "32px 20px" }}>

        {/* ── Stats ── */}
        {currentUser && !loading && data && (
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 32 }}>
            <StatBox emoji="🛒" label="Total Orders" value={totalOrders} color="#2d8c5e" />
            <StatBox emoji="💳" label="Total Spent" value={`$${totalSpend.toFixed(0)}`} color="#1e7a5e" />
            <StatBox emoji="🌿" label="CO₂ Saved" value={totalCarbon.toFixed(2)} unit="kg" color="#27ae60" />
            <StatBox emoji="♻️" label="Plastic Avoided" value={`${totalPlastic.toFixed(0)}g`} color="#1565c0" />
          </div>
        )}

        {/* ── Progress Bar ── */}
        {currentUser && !loading && nextTier && (
          <div style={{ background: "white", borderRadius: 12, padding: "24px 28px", marginBottom: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontWeight: 700, color: "#1a3d2b" }}>Progress to {nextTier.emoji} {nextTier.label} tier</span>
              <span style={{ color: "#2d8c5e", fontWeight: 600 }}>{greenCredits} / {nextTier.credits} credits</span>
            </div>
            <div style={{ background: "#e8f5e9", borderRadius: 10, height: 14, overflow: "hidden" }}>
              <div style={{
                height: "100%", borderRadius: 10,
                background: "linear-gradient(90deg, #2d8c5e, #4caf50)",
                width: `${progressPct}%`, transition: "width 0.5s ease",
              }} />
            </div>
            <p style={{ margin: "8px 0 0", fontSize: 13, color: "#666" }}>
              {nextTier.credits - greenCredits} more credits to unlock {nextTier.emoji} {nextTier.label} (${nextTier.discount} off)
            </p>
          </div>
        )}

        {/* ── Redemption Tiers ── */}
        <h2 style={{ color: "#1a3d2b", marginBottom: 16 }}>🎁 Redemption Tiers</h2>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 32 }}>
          {TIERS.map((tier) => {
            const unlocked = greenCredits >= tier.credits;
            return (
              <div key={tier.credits} style={{
                flex: 1, minWidth: 200, background: "white", borderRadius: 12, padding: "22px 20px",
                boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
                border: `2px solid ${unlocked ? tier.color : "#e0e0e0"}`,
                opacity: unlocked ? 1 : 0.6,
                position: "relative", overflow: "hidden",
              }}>
                {unlocked && (
                  <div style={{
                    position: "absolute", top: 10, right: 10,
                    background: tier.color, color: "white",
                    fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 10,
                  }}>UNLOCKED</div>
                )}
                <div style={{ fontSize: 32, marginBottom: 8 }}>{tier.emoji}</div>
                <div style={{ fontWeight: 800, fontSize: 20, color: tier.color }}>{tier.credits} Credits</div>
                <div style={{ fontWeight: 700, fontSize: 18, color: "#1a3d2b", margin: "4px 0" }}>= ${tier.discount} Off</div>
                <div style={{ fontSize: 13, color: "#666" }}>{tier.label} tier reward</div>
              </div>
            );
          })}
        </div>

        {/* ── Redeem Form ── */}
        {currentUser && !loading && (
          <div style={{ background: "white", borderRadius: 12, padding: "24px 28px", marginBottom: 32, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <h2 style={{ color: "#1a3d2b", marginTop: 0, marginBottom: 16 }}>✦ Redeem Your Credits</h2>
            <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
              <input
                type="number" min="1" max={greenCredits}
                value={redeemAmt}
                onChange={(e) => setRedeemAmt(e.target.value)}
                placeholder="Enter amount"
                style={{
                  padding: "10px 14px", border: "1.5px solid #c8e6c9",
                  borderRadius: 8, fontSize: 15, width: 160, outline: "none",
                }}
              />
              <button
                onClick={handleRedeem}
                disabled={redeemLoading || !redeemAmt || parseInt(redeemAmt) > greenCredits || parseInt(redeemAmt) < 1}
                style={{
                  padding: "11px 28px", background: "#2d8c5e", color: "white",
                  border: "none", borderRadius: 8, fontWeight: 700, cursor: "pointer", fontSize: 15,
                  opacity: (redeemLoading || !redeemAmt || parseInt(redeemAmt) > greenCredits) ? 0.5 : 1,
                }}
              >
                {redeemLoading ? "Redeeming…" : "Redeem Credits"}
              </button>
              <span style={{ color: "#888", fontSize: 13 }}>Balance: <strong>{greenCredits}</strong> credits</span>
            </div>
            {redeemMsg && (
              <p style={{ marginTop: 12, fontWeight: 600, color: redeemMsg.type === "success" ? "#2d8c5e" : "#e53935" }}>
                {redeemMsg.text}
              </p>
            )}
          </div>
        )}

        {/* ── How to Earn ── */}
        <h2 style={{ color: "#1a3d2b", marginBottom: 16 }}>📖 How to Earn Green Credits</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16, marginBottom: 32 }}>
          {[
            { emoji: "🛒", rule: "1 Credit per $1 spent on any eco product" },
            { emoji: "🌿", rule: "Bonus credits for choosing certified organic items" },
            { emoji: "♻️", rule: "Extra credits for buying recycled-material products" },
            { emoji: "📦", rule: "Credits scale with your order total — shop more, earn more" },
          ].map((r, i) => (
            <div key={i} style={{
              background: "white", borderRadius: 10, padding: "16px 18px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)", display: "flex", gap: 12, alignItems: "flex-start",
            }}>
              <span style={{ fontSize: 24 }}>{r.emoji}</span>
              <p style={{ margin: 0, fontSize: 14, color: "#444", lineHeight: 1.5 }}>{r.rule}</p>
            </div>
          ))}
        </div>

        {/* ── Achievements ── */}
        <h2 style={{ color: "#1a3d2b", marginBottom: 16 }}>🏆 Sustainability Achievements</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginBottom: 40 }}>
          {ACHIEVEMENTS.map((a) => {
            let earned = false;
            if (currentUser && data) {
              if (a.id === "first_order")  earned = totalOrders >= 1;
              if (a.id === "carbon_10")    earned = totalCarbon >= 10;
              if (a.id === "spender_100")  earned = totalSpend >= 100;
              if (a.id === "credits_50")   earned = greenCredits >= 50;
              if (a.id === "plastic_500")  earned = totalPlastic >= 500;
            }
            return (
              <div key={a.id} style={{
                background: earned ? "linear-gradient(135deg, #e8f5e9, #c8e6c9)" : "white",
                border: `2px solid ${earned ? "#2d8c5e" : "#e0e0e0"}`,
                borderRadius: 12, padding: "16px 18px", minWidth: 200, flex: 1,
                opacity: earned ? 1 : 0.55, transition: "all 0.2s",
              }}>
                <div style={{ fontSize: 28, marginBottom: 6 }}>{a.emoji}</div>
                <div style={{ fontWeight: 700, color: "#1a3d2b", fontSize: 14 }}>{a.title}</div>
                <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>{a.desc}</div>
                {earned && <div style={{ marginTop: 8, fontSize: 12, fontWeight: 700, color: "#2d8c5e" }}>✓ Earned!</div>}
              </div>
            );
          })}
        </div>

        <div style={{ textAlign: "center" }}>
          <Link to="/">
            <button style={{
              padding: "14px 36px", background: "#2d8c5e", color: "white",
              border: "none", borderRadius: 25, fontWeight: 700, cursor: "pointer", fontSize: 15,
            }}>
              🌿 Shop & Earn Credits
            </button>
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RewardsPage;
