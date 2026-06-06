import React from "react";

/**
 * Derives badges from product fields:
 *   materials[]             — array of strings e.g. ["organic cotton","bamboo"]
 *   carbonEmissionPercentage — number (<=10 = Low Carbon)
 */
const BADGE_RULES = [
  {
    key: "low-carbon",
    emoji: "🌿",
    label: "Low Carbon",
    color: "#2d8c5e",
    bg: "#e8f5e9",
    test: (p) => p.carbonEmissionPercentage != null && p.carbonEmissionPercentage <= 10,
  },
  {
    key: "recycled",
    emoji: "♻️",
    label: "Recycled Material",
    color: "#1565c0",
    bg: "#e3f2fd",
    test: (p) => (p.materials || []).some((m) => /recycle/i.test(m)),
  },
  {
    key: "plastic-free",
    emoji: "🌱",
    label: "Plastic Free",
    color: "#558b2f",
    bg: "#f1f8e9",
    test: (p) => (p.materials || []).some((m) => /bamboo|hemp|cotton|linen|glass|steel|cork|beeswax|plant/i.test(m)),
  },
  {
    key: "organic",
    emoji: "🌾",
    label: "Organic Material",
    color: "#e65100",
    bg: "#fff3e0",
    test: (p) => (p.materials || []).some((m) => /organic/i.test(m)),
  },
];

const SustainabilityBadges = ({ product, size = "sm" }) => {
  if (!product) return null;
  const badges = BADGE_RULES.filter((rule) => rule.test(product));
  if (badges.length === 0) return null;

  const padding  = size === "lg" ? "5px 12px" : "3px 8px";
  const fontSize = size === "lg" ? "13px" : "11px";
  const gap      = size === "lg" ? "8px" : "5px";

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap }}>
      {badges.map((b) => (
        <span
          key={b.key}
          title={b.label}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
            padding,
            borderRadius: "20px",
            background: b.bg,
            color: b.color,
            fontSize,
            fontWeight: 600,
            border: `1px solid ${b.color}33`,
            whiteSpace: "nowrap",
          }}
        >
          {b.emoji} {b.label}
        </span>
      ))}
    </div>
  );
};

export default SustainabilityBadges;
export { BADGE_RULES };
