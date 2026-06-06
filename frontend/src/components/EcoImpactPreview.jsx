import React, { useEffect, useState } from "react";
import { publicRequest } from "../requestMethods";

/**
 * Shows eco impact preview for a given cart total.
 * Used in Cart.jsx BEFORE checkout confirmation.
 */
const EcoImpactPreview = ({ total }) => {
  const [impact, setImpact] = useState(null);

  useEffect(() => {
    if (!total || total <= 0) return;
    publicRequest
      .get(`/sustainability/preview?amount=${total}`)
      .then((res) => setImpact(res.data))
      .catch(() => {});
  }, [total]);

  if (!impact) return null;

  return (
    <div style={{
      background: "linear-gradient(135deg, #e8f5e9, #c8e6c9)",
      borderRadius: 12, padding: "18px 20px", margin: "16px 0",
      border: "1px solid #a5d6a7",
    }}>
      <p style={{ fontWeight: 700, color: "#1a3d2b", margin: "0 0 12px", fontSize: 14, textAlign: "center" }}>
        🌍 This Purchase Will Save:
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <div style={{ background: "white", borderRadius: 8, padding: "10px 12px", textAlign: "center" }}>
          <p style={{ margin: 0, fontSize: 10, color: "#888", textTransform: "uppercase", letterSpacing: "0.5px" }}>CO₂ Saved</p>
          <p style={{ margin: 0, fontWeight: 700, color: "#2e7d32", fontSize: 18 }}>🌿 {impact.carbonSaved?.toFixed(2)} kg</p>
        </div>
        <div style={{ background: "white", borderRadius: 8, padding: "10px 12px", textAlign: "center" }}>
          <p style={{ margin: 0, fontSize: 10, color: "#888", textTransform: "uppercase", letterSpacing: "0.5px" }}>Plastic Avoided</p>
          <p style={{ margin: 0, fontWeight: 700, color: "#1565c0", fontSize: 18 }}>♻️ {impact.plasticSaved?.toFixed(0)}g</p>
        </div>
        <div style={{ background: "white", borderRadius: 8, padding: "10px 12px", textAlign: "center" }}>
          <p style={{ margin: 0, fontSize: 10, color: "#888", textTransform: "uppercase", letterSpacing: "0.5px" }}>Tree Equivalent</p>
          <p style={{ margin: 0, fontWeight: 700, color: "#00695c", fontSize: 18 }}>🌳 {impact.treesEquivalent?.toFixed(1)} days</p>
        </div>
        <div style={{ background: "#fff8e1", borderRadius: 8, padding: "10px 12px", textAlign: "center" }}>
          <p style={{ margin: 0, fontSize: 10, color: "#888", textTransform: "uppercase", letterSpacing: "0.5px" }}>Credits to Earn</p>
          <p style={{ margin: 0, fontWeight: 700, color: "#e65100", fontSize: 18 }}>✦ {impact.greenCreditsEarned}</p>
        </div>
      </div>
    </div>
  );
};

export default EcoImpactPreview;
