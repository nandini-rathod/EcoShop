import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { publicRequest } from "../requestMethods";
import SustainabilityBadges from "./SustainabilityBadges";

const RelatedProducts = ({ productId }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!productId) return;
    setLoading(true);
    publicRequest
      .get(`/products/related/${productId}`)
      .then((res) => setProducts(res.data.products || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [productId]);

  if (loading || products.length === 0) return null;

  return (
    <div style={{ padding: "40px 20px", background: "#f9fdfb", borderTop: "1px solid #e0f0e8" }}>
      <h2 style={{ textAlign: "center", color: "#1a3d2b", marginBottom: 28, fontSize: 22, fontWeight: 700 }}>
        🌿 You May Also Like
      </h2>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center", maxWidth: 1100, margin: "0 auto" }}>
        {products.map((p) => (
          <Link
            key={p._id}
            to={`/product/${p._id}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div
              style={{
                width: 220, background: "white", borderRadius: 12,
                overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
                transition: "transform 0.2s, box-shadow 0.2s", cursor: "pointer",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.07)"; }}
            >
              <img
                src={p.img}
                alt={p.title}
                style={{ width: "100%", height: 160, objectFit: "cover" }}
              />
              <div style={{ padding: "12px 14px" }}>
                <p style={{ margin: "0 0 6px", fontWeight: 600, fontSize: 14, color: "#1a3d2b", lineHeight: 1.3 }}>{p.title}</p>
                <p style={{ margin: "0 0 8px", fontWeight: 700, color: "#2d8c5e", fontSize: 15 }}>${p.price}</p>
                <SustainabilityBadges product={p} size="sm" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
