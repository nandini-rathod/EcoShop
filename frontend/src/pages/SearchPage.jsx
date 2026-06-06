import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SustainabilityBadges from "../components/SustainabilityBadges";
import { useDispatch } from "react-redux";
import { addProduct } from "../redux/cartRedux";

const useQuery = () => new URLSearchParams(useLocation().search);

const SearchPage = () => {
  const dispatch  = useDispatch();
  const query     = useQuery();
  const q         = query.get("q") || "";

  const [products, setProducts]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [localQ, setLocalQ]         = useState(q);
  const [sortBy, setSortBy]         = useState("relevance");

  useEffect(() => {
    if (!q.trim()) { setProducts([]); setLoading(false); return; }
    setLoading(true);
    axios
      .get(`https://ecoshop-xoeh.onrender.com/api/products/search?q=${encodeURIComponent(q)}`)
      .then((res) => setProducts(res.data.products || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [q]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (localQ.trim()) window.location.href = `/search?q=${encodeURIComponent(localQ.trim())}`;
  };

  const sorted = [...products].sort((a, b) => {
    if (sortBy === "price-asc")  return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    return 0;
  });

  return (
    <div style={{ background: "#f5faf6", minHeight: "100vh" }}>
      <Navbar />

      {/* ── Search Header ── */}
      <div style={{
        background: "linear-gradient(135deg, #1a3d2b, #2d8c5e)",
        padding: "36px 24px", color: "white",
      }}>
        <form onSubmit={handleSearch} style={{ display: "flex", gap: 12, maxWidth: 600, margin: "0 auto", justifyContent: "center" }}>
          <input
            type="text"
            value={localQ}
            onChange={(e) => setLocalQ(e.target.value)}
            placeholder="Search eco products, materials, categories…"
            style={{
              flex: 1, padding: "13px 18px", borderRadius: 10, border: "none",
              fontSize: 15, outline: "none",
            }}
          />
          <button type="submit" style={{
            padding: "13px 24px", background: "#e0f7a2", color: "#1a3d2b",
            border: "none", borderRadius: 10, fontWeight: 700, cursor: "pointer", fontSize: 15,
          }}>
            🔍 Search
          </button>
        </form>
        {q && !loading && (
          <p style={{ textAlign: "center", marginTop: 12, opacity: 0.85, fontSize: 14 }}>
            {sorted.length} result{sorted.length !== 1 ? "s" : ""} for "<strong>{q}</strong>"
          </p>
        )}
      </div>

      <div style={{ maxWidth: 1060, margin: "0 auto", padding: "28px 20px" }}>
        {/* Sort */}
        {sorted.length > 0 && (
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 20 }}>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{ padding: "8px 14px", border: "1.5px solid #c8e6c9", borderRadius: 8, fontSize: 14, outline: "none" }}
            >
              <option value="relevance">Sort: Relevance</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        )}

        {loading && (
          <div style={{ textAlign: "center", padding: "80px", color: "#888" }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>🔍</div>
            <p>Searching eco products…</p>
          </div>
        )}

        {!loading && !q && (
          <div style={{ textAlign: "center", padding: "80px", color: "#888" }}>
            <p style={{ fontSize: 36 }}>🌿</p>
            <p>Enter a search term above to discover eco products.</p>
          </div>
        )}

        {!loading && q && sorted.length === 0 && (
          <div style={{ textAlign: "center", padding: "80px", color: "#888" }}>
            <p style={{ fontSize: 36 }}>😔</p>
            <p>No products found for "<strong>{q}</strong>".</p>
            <Link to="/shop-by-values" style={{ color: "#2d8c5e", fontWeight: 600 }}>
              Browse all eco products →
            </Link>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 20 }}>
          {sorted.map((item) => (
            <div key={item._id} style={{
              background: "white", borderRadius: 12, overflow: "hidden",
              boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
            }}>
              <Link to={`/product/${item._id}`}>
                <img src={item.img} alt={item.title} style={{ width: "100%", height: 200, objectFit: "cover" }} />
              </Link>
              <div style={{ padding: "14px 16px" }}>
                <Link to={`/product/${item._id}`} style={{ textDecoration: "none" }}>
                  <p style={{ margin: "0 0 4px", fontWeight: 700, fontSize: 15, color: "#1a3d2b" }}>{item.title}</p>
                </Link>
                <p style={{ margin: "0 0 6px", fontSize: 13, color: "#555", lineHeight: 1.4 }}>{item.desc?.slice(0, 65)}…</p>
                <p style={{ margin: "0 0 10px", fontWeight: 700, color: "#2d8c5e", fontSize: 16 }}>${item.price}</p>
                <SustainabilityBadges product={item} size="sm" />
                <button
                  onClick={() => dispatch(addProduct({ ...item, quantity: 1, color: item.color?.[0] || "", size: item.size?.[0] || "" }))}
                  style={{
                    marginTop: 12, width: "100%", padding: "9px", background: "#2d8c5e", color: "white",
                    border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer", fontSize: 13,
                  }}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SearchPage;
