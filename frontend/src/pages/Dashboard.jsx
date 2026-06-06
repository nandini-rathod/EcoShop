import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  fetchDashboardStart,
  fetchDashboardSuccess,
  fetchDashboardFailure,
  updateCreditsLocally,
} from "../redux/sustainabilityRedux";
import { publicRequest } from "../requestMethods";
import "./Dashboard.css";

// ─── Stat Card ───────────────────────────────────────────────────────────────
const StatCard = ({ icon, label, value, unit, color, sublabel }) => (
  <div className="eco-stat-card" style={{ borderTopColor: color }}>
    <div className="eco-stat-icon" style={{ background: `${color}18` }}>
      <span style={{ color }}>{icon}</span>
    </div>
    <div className="eco-stat-body">
      <p className="eco-stat-label">{label}</p>
      <div className="eco-stat-value-row">
        <span className="eco-stat-value">{value}</span>
        {unit && <span className="eco-stat-unit">{unit}</span>}
      </div>
      {sublabel && <p className="eco-stat-sublabel">{sublabel}</p>}
    </div>
  </div>
);

// ─── Custom Tooltip ──────────────────────────────────────────────────────────
const EcoTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="eco-tooltip">
        <p className="eco-tooltip-label">{label}</p>
        {payload.map((entry, i) => (
          <p key={i} style={{ color: entry.color }} className="eco-tooltip-item">
            {entry.name}: <strong>{entry.value}</strong>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// ─── Impact History Row ──────────────────────────────────────────────────────
const ImpactRow = ({ entry }) => {
  const date = new Date(entry.date);
  const dateStr = date.toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
  return (
    <tr className="eco-history-row">
      <td className="eco-td eco-td-date">{dateStr}</td>
      <td className="eco-td eco-td-amount">${entry.amount?.toFixed(2)}</td>
      <td className="eco-td eco-td-carbon">
        <span className="eco-badge eco-badge-green">
          🌿 {entry.carbonSaved?.toFixed(2)} kg
        </span>
      </td>
      <td className="eco-td eco-td-plastic">
        <span className="eco-badge eco-badge-blue">
          ♻️ {entry.plasticSaved?.toFixed(0)}g
        </span>
      </td>
      <td className="eco-td eco-td-trees">
        <span className="eco-badge eco-badge-teal">
          🌳 {entry.treesEquivalent?.toFixed(1)} days
        </span>
      </td>
      <td className="eco-td eco-td-credits">
        <span className="eco-badge eco-badge-gold">
          ✦ {entry.greenCreditsEarned}
        </span>
      </td>
    </tr>
  );
};

// ─── Main Component ──────────────────────────────────────────────────────────
const Dashboard = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const currentUser = useSelector((state) => state.user.currentUser);
  console.log("CURRENT USER", currentUser);
  console.log("USER ID", currentUser?._id);
  const { dashboard, isFetching, error } = useSelector(
    (state) => state.sustainability
  );
  const [activeChart, setActiveChart] = useState("spend");
  const [redeemAmount, setRedeemAmount] = useState("");
  const [redeemMsg, setRedeemMsg] = useState(null);
  const [redeemLoading, setRedeemLoading] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!currentUser) {
      history.push("/login");
    }
  }, [currentUser, history]);

  const fetchDashboard = useCallback(async () => {
    const userId = currentUser?._id || currentUser?.id;
    if (!userId) return;
    dispatch(fetchDashboardStart());
    try {
      const res = await publicRequest.get(
        `/sustainability/dashboard/${userId}`
      );
      dispatch(fetchDashboardSuccess(res.data));
    } catch (err) {
      dispatch(fetchDashboardFailure());
    }
  }, [currentUser, dispatch]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const handleRedeem = async () => {
    const amount = parseInt(redeemAmount, 10);
    if (!amount || amount <= 0) return;
    setRedeemLoading(true);
    setRedeemMsg(null);
    const userId = currentUser?._id || currentUser?.id;
    try {
      const res = await publicRequest.post(
        `/sustainability/redeem/${userId}`,
        { credits: amount }
      );
      dispatch(updateCreditsLocally(amount));
      setRedeemMsg({ type: "success", text: res.data.message });
      setRedeemAmount("");
      // Refresh dashboard after redemption
      setTimeout(fetchDashboard, 1000);
    } catch (err) {
      const msg = err.response?.data || "Redemption failed";
      setRedeemMsg({ type: "error", text: msg });
    } finally {
      setRedeemLoading(false);
    }
  };

  if (!currentUser) return null;

  const chartData = dashboard?.monthlyData || [];
  const purchaseHistory = dashboard?.purchaseHistory || [];

  // Chart configuration
  const chartConfigs = {
    spend: { key: "spend", color: "#2d8c5e", label: "Monthly Spend ($)" },
    carbon: { key: "CO₂ Saved (kg)", color: "#1a9e6e", label: "CO₂ Saved (kg)" },
    credits: { key: "Green Credits", color: "#f0a500", label: "Green Credits Earned" },
  };
  const activeConfig = chartConfigs[activeChart];

  return (
    <div className="eco-dashboard-page">
      <Navbar />
      <div className="eco-dashboard-container">
        {/* ── Header ── */}
        <div className="eco-dashboard-header">
          <div>
            <h1 className="eco-dashboard-title">
              <span className="eco-leaf">🌍</span> My Sustainability Dashboard
            </h1>
            <p className="eco-dashboard-subtitle">
              Track your eco-impact, green credits, and carbon footprint reduction
            </p>
          </div>
          <div className="eco-header-badge">
            <span className="eco-header-badge-icon">🌿</span>
            <span className="eco-header-badge-text">Eco Shopper</span>
          </div>
        </div>

        {/* ── Error / Loading ── */}
        {isFetching && (
          <div className="eco-loading">
            <div className="eco-spinner" />
            <p>Loading your eco-impact data…</p>
          </div>
        )}
        {error && !isFetching && (
          <div className="eco-error-banner">
            ⚠️ Could not load dashboard data. Make sure the backend is running.
            <button className="eco-retry-btn" onClick={fetchDashboard}>
              Retry
            </button>
          </div>
        )}

        {dashboard && (
          <>
            {/* ── KPI Cards ── */}
            <div className="eco-stat-grid">
              <StatCard
                icon="🛒"
                label="Total Orders"
                value={dashboard.totalOrders}
                color="#2d8c5e"
                sublabel="Eco-friendly purchases"
              />
              <StatCard
                icon="💳"
                label="Total Spend"
                value={`$${dashboard.totalSpend?.toFixed(2)}`}
                color="#1e7a5e"
                sublabel="Invested in sustainability"
              />
              <StatCard
                icon="✦"
                label="Green Credits"
                value={dashboard.greenCredits}
                unit="credits"
                color="#f0a500"
                sublabel="1 credit per $1 spent"
              />
              <StatCard
                icon="🌿"
                label="CO₂ Saved"
                value={dashboard.totalCarbonSaved?.toFixed(2)}
                unit="kg"
                color="#27ae60"
                sublabel="vs conventional products"
              />
              <StatCard
                icon="♻️"
                label="Plastic Avoided"
                value={dashboard.totalPlasticSaved?.toFixed(0)}
                unit="g"
                color="#2980b9"
                sublabel="Packaging waste reduced"
              />
              <StatCard
                icon="🌳"
                label="Trees Equivalent"
                value={dashboard.treesEquivalent?.toFixed(1)}
                unit="days"
                color="#16a085"
                sublabel="CO₂ absorption equivalent"
              />
            </div>

            {/* ── Green Credits Panel ── */}
            <div className="eco-credits-panel">
              <div className="eco-credits-info">
                <div className="eco-credits-balance">
                  <span className="eco-credits-icon">✦</span>
                  <div>
                    <p className="eco-credits-balance-label">Available Green Credits</p>
                    <p className="eco-credits-balance-value">{dashboard.greenCredits}</p>
                  </div>
                </div>
                <div className="eco-credits-explanation">
                  <p>
                    Earn <strong>1 Green Credit per $1</strong> spent on eco-products.
                    Redeem them for discounts on future purchases.
                  </p>
                  <ul className="eco-credits-rewards">
                    <li>🎁 50 credits = $5 off</li>
                    <li>🎁 100 credits = $12 off</li>
                    <li>🎁 200 credits = $30 off</li>
                  </ul>
                </div>
              </div>
              <div className="eco-redeem-form">
                <p className="eco-redeem-label">Redeem Credits</p>
                <div className="eco-redeem-row">
                  <input
                    type="number"
                    className="eco-redeem-input"
                    placeholder="Amount"
                    min="1"
                    max={dashboard.greenCredits}
                    value={redeemAmount}
                    onChange={(e) => setRedeemAmount(e.target.value)}
                  />
                  <button
                    className="eco-redeem-btn"
                    onClick={handleRedeem}
                    disabled={
                      redeemLoading ||
                      !redeemAmount ||
                      parseInt(redeemAmount) > dashboard.greenCredits
                    }
                  >
                    {redeemLoading ? "…" : "Redeem"}
                  </button>
                </div>
                {redeemMsg && (
                  <p
                    className={`eco-redeem-msg ${
                      redeemMsg.type === "success" ? "eco-msg-success" : "eco-msg-error"
                    }`}
                  >
                    {redeemMsg.text}
                  </p>
                )}
              </div>
            </div>

            {/* ── Charts Section ── */}
            {chartData.length > 0 ? (
              <div className="eco-charts-section">
                <div className="eco-chart-header">
                  <h2 className="eco-section-title">Monthly Impact Overview</h2>
                  <div className="eco-chart-tabs">
                    {Object.entries(chartConfigs).map(([key, cfg]) => (
                      <button
                        key={key}
                        className={`eco-chart-tab ${activeChart === key ? "active" : ""}`}
                        onClick={() => setActiveChart(key)}
                      >
                        {cfg.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="eco-chart-wrapper">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                      <CartesianGrid stroke="#e8f5e9" strokeDasharray="5 5" />
                      <XAxis dataKey="name" stroke="#555" />
                      <YAxis stroke="#555" />
                      <Tooltip content={<EcoTooltip />} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey={activeConfig.key}
                        stroke={activeConfig.color}
                        strokeWidth={2.5}
                        dot={{ r: 4, fill: activeConfig.color }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Combo bar chart — CO2 + Credits */}
                <div className="eco-chart-header" style={{ marginTop: 32 }}>
                  <h2 className="eco-section-title">CO₂ Saved vs Green Credits Earned</h2>
                </div>
                <div className="eco-chart-wrapper">
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={chartData}>
                      <CartesianGrid stroke="#e8f5e9" strokeDasharray="5 5" />
                      <XAxis dataKey="name" stroke="#555" />
                      <YAxis yAxisId="left" stroke="#27ae60" />
                      <YAxis yAxisId="right" orientation="right" stroke="#f0a500" />
                      <Tooltip content={<EcoTooltip />} />
                      <Legend />
                      <Bar
                        yAxisId="left"
                        dataKey="CO₂ Saved (kg)"
                        fill="#27ae60"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        yAxisId="right"
                        dataKey="Green Credits"
                        fill="#f0a500"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ) : (
              <div className="eco-empty-chart">
                <span className="eco-empty-icon">📊</span>
                <p>No purchase data yet. Start shopping to see your eco-impact!</p>
                <button className="eco-shop-btn" onClick={() => history.push("/")}>
                  Explore Eco Products
                </button>
              </div>
            )}

            {/* ── Carbon Impact Tracker ── */}
            <div className="eco-carbon-section">
              <h2 className="eco-section-title">🌿 Carbon Impact Tracker</h2>
              <div className="eco-carbon-summary">
                <div className="eco-carbon-card">
                  <div className="eco-carbon-card-icon">🏭</div>
                  <div>
                    <p className="eco-carbon-card-label">Total CO₂ Saved</p>
                    <p className="eco-carbon-card-value">
                      {dashboard.totalCarbonSaved?.toFixed(3)}{" "}
                      <span className="eco-carbon-unit">kg</span>
                    </p>
                    <p className="eco-carbon-card-note">
                      vs buying conventional products
                    </p>
                  </div>
                </div>
                <div className="eco-carbon-arrow">→</div>
                <div className="eco-carbon-card">
                  <div className="eco-carbon-card-icon">🧴</div>
                  <div>
                    <p className="eco-carbon-card-label">Plastic Waste Avoided</p>
                    <p className="eco-carbon-card-value">
                      {dashboard.totalPlasticSaved?.toFixed(0)}{" "}
                      <span className="eco-carbon-unit">grams</span>
                    </p>
                    <p className="eco-carbon-card-note">
                      sustainable packaging choices
                    </p>
                  </div>
                </div>
                <div className="eco-carbon-arrow">→</div>
                <div className="eco-carbon-card eco-carbon-card-highlight">
                  <div className="eco-carbon-card-icon">🌳</div>
                  <div>
                    <p className="eco-carbon-card-label">Tree Equivalent</p>
                    <p className="eco-carbon-card-value">
                      {dashboard.treesEquivalent?.toFixed(1)}{" "}
                      <span className="eco-carbon-unit">tree-days</span>
                    </p>
                    <p className="eco-carbon-card-note">
                      of CO₂ absorption equivalent
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Purchase Impact History ── */}
            {purchaseHistory.length > 0 && (
              <div className="eco-history-section">
                <h2 className="eco-section-title">📋 Purchase Impact History</h2>
                <div className="eco-history-table-wrapper">
                  <table className="eco-history-table">
                    <thead>
                      <tr>
                        <th className="eco-th">Date</th>
                        <th className="eco-th">Spent</th>
                        <th className="eco-th">CO₂ Saved</th>
                        <th className="eco-th">Plastic Avoided</th>
                        <th className="eco-th">Tree Equiv.</th>
                        <th className="eco-th">Credits Earned</th>
                      </tr>
                    </thead>
                    <tbody>
                      {purchaseHistory.map((entry, i) => (
                        <ImpactRow key={entry.orderId || i} entry={entry} />
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
