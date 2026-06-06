import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SustainabilityBadges from "../components/SustainabilityBadges";
import { useDispatch } from "react-redux";
import { addProduct } from "../redux/cartRedux";

const VALUES = [
  { key: "all",         label: "All Eco Products", emoji: "🌍", desc: "Browse our full sustainable range", color: "#2d8c5e" },
  { key: "low-carbon",  label: "Low Carbon",        emoji: "🌿", desc: "Products with ≤10% carbon emission", color: "#388e3c" },
  { key: "recycled",    label: "Recycled Materials", emoji: "♻️", desc: "Made from recycled or upcycled materials", color: "#1565c0" },
  { key: "plastic-free",label: "Plastic Free",       emoji: "🌱", desc: "Zero plastic in materials or packaging", color: "#558b2f" },
  { key: "organic",     label: "Organic Materials",  emoji: "🌾", desc: "GOTS-certified or verified organic fibres", color: "#e65100" },
];

const ProductCard = ({ item }) => {
  const dispatch = useDispatch();
  return (
    <Link to={`/product/${item._id}`} style={{ textDecoration: "none", color: "inherit" }}>
      <div style={{
        background: "white", borderRadius: 12, overflow: "hidden",
        boxShadow: "0 2px 12px rgba(0,0,0,0.07)", transition: "transform 0.2s, box-shadow 0.2s",
        cursor: "pointer",
      }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.07)"; }}
      >
        <img src={item.img} alt={item.title} style={{ width: "100%", height: 200, objectFit: "cover" }} />
        <div style={{ padding: "14px 16px" }}>
          <p style={{ margin: "0 0 4px", fontWeight: 700, fontSize: 15, color: "#1a3d2b" }}>{item.title}</p>
          <p style={{ margin: "0 0 8px", color: "#555", fontSize: 13, lineHeight: 1.4 }}>{item.desc?.slice(0, 70)}…</p>
          <p style={{ margin: "0 0 10px", fontWeight: 700, color: "#2d8c5e", fontSize: 16 }}>${item.price}</p>
          <SustainabilityBadges product={item} size="sm" />
          <button
            onClick={(e) => { e.preventDefault(); dispatch(addProduct({ ...item, quantity: 1, color: item.color?.[0] || "", size: item.size?.[0] || "" })); }}
            style={{
              marginTop: 12, width: "100%", padding: "9px", background: "#2d8c5e", color: "white",
              border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer", fontSize: 13,
            }}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </Link>
  );
};

const ShopByValuesPage = () => {
  const [activeValue, setActiveValue] = useState("all");
  const [products, setProducts]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [searchQ, setSearchQ]         = useState("");

  useEffect(() => {
    setLoading(true);
    const url = activeValue === "all"
      ? "http://localhost:5001/api/products"
      : `http://localhost:5001/api/products/byvalues?value=${activeValue}`;
    axios.get(url)
      .then((res) => setProducts(res.data.products || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [activeValue]);

  const displayed = searchQ.trim()
    ? products.filter((p) =>
        [p.title, p.desc, ...(p.categories || []), ...(p.materials || [])]
          .join(" ").toLowerCase().includes(searchQ.toLowerCase())
      )
    : products;

  return (
    <div style={{ background: "#f5faf6", minHeight: "100vh" }}>
      <Navbar />

      {/* ── Hero ── */}
      <div style={{
        background: "linear-gradient(135deg, #1a3d2b 0%, #2d8c5e 100%)",
        padding: "48px 24px 40px", textAlign: "center", color: "white",
      }}>
        <h1 style={{ margin: "0 0 12px", fontSize: 32, fontWeight: 800 }}>🌍 Shop by Values</h1>
        <p style={{ margin: "0 0 24px", opacity: 0.9, fontSize: 16, maxWidth: 500, marginLeft: "auto", marginRight: "auto" }}>
          Filter products by what matters most to you. Every item here is better for the planet.
        </p>
        <input
          type="text"
          placeholder="Filter products…"
          value={searchQ}
          onChange={(e) => setSearchQ(e.target.value)}
          style={{
            padding: "12px 20px", borderRadius: 25, border: "none", fontSize: 15,
            width: "100%", maxWidth: 400, outline: "none",
          }}
        />
      </div>

      {/* ── Value Filter Tabs ── */}
      <div style={{ background: "white", borderBottom: "1px solid #e8f5e9", padding: "0 20px" }}>
        <div style={{
          display: "flex", gap: 4, overflowX: "auto", maxWidth: 960,
          margin: "0 auto", scrollbarWidth: "none",
        }}>
          {VALUES.map((v) => (
            <button
              key={v.key}
              onClick={() => setActiveValue(v.key)}
              style={{
                padding: "16px 20px", border: "none", background: "none",
                cursor: "pointer", fontWeight: activeValue === v.key ? 700 : 500,
                color: activeValue === v.key ? v.color : "#666",
                borderBottom: activeValue === v.key ? `3px solid ${v.color}` : "3px solid transparent",
                whiteSpace: "nowrap", fontSize: 14, transition: "all 0.2s",
              }}
            >
              {v.emoji} {v.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Active filter description ── */}
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "20px 20px 0" }}>
        <div style={{
          background: "white", borderRadius: 10, padding: "14px 18px",
          border: `1px solid ${VALUES.find((v) => v.key === activeValue)?.color}33`,
          display: "flex", alignItems: "center", gap: 12,
        }}>
          <span style={{ fontSize: 24 }}>{VALUES.find((v) => v.key === activeValue)?.emoji}</span>
          <div>
            <strong style={{ color: "#1a3d2b" }}>{VALUES.find((v) => v.key === activeValue)?.label}</strong>
            <p style={{ margin: 0, fontSize: 13, color: "#666" }}>{VALUES.find((v) => v.key === activeValue)?.desc}</p>
          </div>
          <span style={{ marginLeft: "auto", color: "#888", fontSize: 13 }}>
            {loading ? "Loading…" : `${displayed.length} products`}
          </span>
        </div>
      </div>

      {/* ── Product Grid ── */}
      <div style={{ maxWidth: 960, margin: "24px auto 40px", padding: "0 20px" }}>
        {loading && (
          <div style={{ textAlign: "center", padding: "60px", color: "#888" }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🌿</div>
            <p>Loading eco products…</p>
          </div>
        )}
        {!loading && displayed.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px", color: "#888" }}>
            <p style={{ fontSize: 32 }}>🔍</p>
            <p>No products found for this filter.</p>
          </div>
        )}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 20 }}>
          {displayed.map((item) => <ProductCard key={item._id} item={item} />)}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ShopByValuesPage;
