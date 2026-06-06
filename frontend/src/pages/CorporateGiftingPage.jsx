import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const BUNDLES = [
  {
    name: "Starter Eco Kit",
    emoji: "🌱",
    items: ["Organic Cotton Tote Bag", "Bamboo Toothbrush Set", "Reusable Steel Straw Kit"],
    minQty: 10,
    priceFrom: 29,
    color: "#4caf50",
    desc: "A thoughtful introduction to sustainable living. Perfect for onboarding gifts.",
  },
  {
    name: "Green Office Bundle",
    emoji: "🌿",
    items: ["Bamboo Cutlery Set", "Glass Food Containers", "Eco Laundry Detergent", "Recycled Storage Basket"],
    minQty: 25,
    priceFrom: 64,
    color: "#2d8c5e",
    desc: "Help your team live sustainably both at work and at home.",
    popular: true,
  },
  {
    name: "Premium Eco Executive",
    emoji: "🌳",
    items: ["Recycled Backpack", "Hemp Yoga Mat", "Cork Yoga Block", "Bamboo Water Bottle"],
    minQty: 5,
    priceFrom: 149,
    color: "#1a3d2b",
    desc: "Premium sustainable gifts for leadership, VIP clients, or special milestones.",
  },
];

const BENEFITS = [
  { emoji: "🌍", title: "Measurable ESG Impact", desc: "Each bundle includes a CO₂ savings certificate documenting your company's environmental contribution." },
  { emoji: "🎁", title: "Custom Branding", desc: "Add your logo to tote bags, packaging, and inserts at no extra charge on orders of 50+." },
  { emoji: "📦", title: "Plastic-Free Packaging", desc: "All bundles are shipped in 100% compostable or recycled cardboard — no bubble wrap, no plastic." },
  { emoji: "✦",  title: "Green Credits for Your Team", desc: "Bulk orders earn Green Credits for every recipient, giving them savings on future eco purchases." },
  { emoji: "🚀", title: "Fast Fulfilment", desc: "Dedicated corporate team ensures delivery within 5–7 business days, with tracking on every parcel." },
  { emoji: "💬", title: "Sustainability Report", desc: "Receive a post-delivery impact report perfect for your CSR documentation and annual reporting." },
];

const CorporateGiftingPage = () => {
  const [formData, setFormData] = useState({ name: "", company: "", email: "", quantity: "", bundle: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    // In production this would POST to a contact endpoint
    setSubmitted(true);
  };

  return (
    <div style={{ background: "#f5faf6", minHeight: "100vh" }}>
      <Navbar />

      {/* ── Hero ── */}
      <div style={{
        background: "linear-gradient(135deg, #1a3d2b 0%, #2d8c5e 60%, #4caf50 100%)",
        padding: "60px 24px 48px", textAlign: "center", color: "white",
      }}>
        <div style={{ fontSize: 52, marginBottom: 12 }}>🤝</div>
        <h1 style={{ margin: "0 0 12px", fontSize: 36, fontWeight: 800 }}>Corporate Gifting</h1>
        <p style={{ margin: "0 auto", opacity: 0.9, fontSize: 17, maxWidth: 560, lineHeight: 1.7 }}>
          Give gifts that give back. Our sustainable corporate bundles help your company make a
          measurable environmental impact while delighting clients and employees.
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 28, flexWrap: "wrap" }}>
          {["🌿 100% Eco-Certified", "♻️ Plastic-Free Packaging", "✦ Bulk Discounts"].map((badge) => (
            <span key={badge} style={{
              background: "rgba(255,255,255,0.15)", padding: "8px 18px",
              borderRadius: 20, fontSize: 14, fontWeight: 600,
              border: "1px solid rgba(255,255,255,0.3)",
            }}>{badge}</span>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1040, margin: "0 auto", padding: "48px 20px" }}>

        {/* ── Gift Bundles ── */}
        <h2 style={{ color: "#1a3d2b", textAlign: "center", marginBottom: 8, fontSize: 26 }}>
          🎁 Sustainable Gift Bundles
        </h2>
        <p style={{ textAlign: "center", color: "#666", marginBottom: 32 }}>
          Curated collections for every corporate occasion
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24, marginBottom: 56 }}>
          {BUNDLES.map((bundle) => (
            <div key={bundle.name} style={{
              background: "white", borderRadius: 16, padding: "28px 24px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              border: `2px solid ${bundle.popular ? bundle.color : "#e8f5e9"}`,
              position: "relative",
            }}>
              {bundle.popular && (
                <div style={{
                  position: "absolute", top: -1, left: "50%", transform: "translateX(-50%)",
                  background: bundle.color, color: "white", fontSize: 11, fontWeight: 700,
                  padding: "4px 16px", borderRadius: "0 0 10px 10px",
                }}>MOST POPULAR</div>
              )}
              <div style={{ fontSize: 36, marginBottom: 8 }}>{bundle.emoji}</div>
              <h3 style={{ margin: "0 0 8px", color: "#1a3d2b", fontSize: 20 }}>{bundle.name}</h3>
              <p style={{ color: "#666", fontSize: 14, marginBottom: 16, lineHeight: 1.6 }}>{bundle.desc}</p>
              <ul style={{ margin: "0 0 16px", paddingLeft: 18, color: "#444", fontSize: 14 }}>
                {bundle.items.map((item) => <li key={item} style={{ marginBottom: 4 }}>🌿 {item}</li>)}
              </ul>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #e8f5e9", paddingTop: 14 }}>
                <div>
                  <div style={{ fontWeight: 700, color: bundle.color, fontSize: 18 }}>From ${bundle.priceFrom}/bundle</div>
                  <div style={{ fontSize: 12, color: "#888" }}>Min. {bundle.minQty} units</div>
                </div>
                <a href="#contact-form" style={{
                  padding: "10px 18px", background: bundle.color, color: "white",
                  borderRadius: 8, textDecoration: "none", fontWeight: 600, fontSize: 14,
                }}>Get a Quote</a>
              </div>
            </div>
          ))}
        </div>

        {/* ── Benefits ── */}
        <h2 style={{ color: "#1a3d2b", textAlign: "center", marginBottom: 8, fontSize: 26 }}>
          Why Choose EcoShop Corporate?
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16, marginBottom: 56 }}>
          {BENEFITS.map((b) => (
            <div key={b.title} style={{
              background: "white", borderRadius: 12, padding: "20px 22px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
              display: "flex", gap: 14, alignItems: "flex-start",
            }}>
              <span style={{ fontSize: 26, flexShrink: 0 }}>{b.emoji}</span>
              <div>
                <div style={{ fontWeight: 700, color: "#1a3d2b", marginBottom: 4 }}>{b.title}</div>
                <div style={{ fontSize: 13, color: "#555", lineHeight: 1.6 }}>{b.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Impact Stats ── */}
        <div style={{
          background: "linear-gradient(135deg, #1a3d2b, #2d8c5e)",
          borderRadius: 16, padding: "36px 32px", textAlign: "center",
          color: "white", marginBottom: 56,
        }}>
          <h2 style={{ margin: "0 0 24px", fontSize: 22 }}>🌍 Corporate Impact at a Glance</h2>
          <div style={{ display: "flex", justifyContent: "center", gap: 40, flexWrap: "wrap" }}>
            {[
              { value: "500+", label: "Corporate Clients" },
              { value: "2.4t", label: "CO₂ Saved Together" },
              { value: "18kg", label: "Avg Plastic Saved/Order" },
              { value: "100%", label: "Plastic-Free Packaging" },
            ].map((stat) => (
              <div key={stat.label}>
                <div style={{ fontSize: 28, fontWeight: 800 }}>{stat.value}</div>
                <div style={{ fontSize: 13, opacity: 0.85 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Contact Form ── */}
        <div id="contact-form" style={{ background: "white", borderRadius: 16, padding: "40px 36px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
          <h2 style={{ color: "#1a3d2b", marginTop: 0, marginBottom: 6 }}>📬 Request a Corporate Quote</h2>
          <p style={{ color: "#666", marginBottom: 28 }}>We'll get back to you within one business day.</p>
          {submitted ? (
            <div style={{ textAlign: "center", padding: "32px" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
              <h3 style={{ color: "#2d8c5e" }}>Request Received!</h3>
              <p style={{ color: "#666" }}>Our corporate team will contact you within 24 hours.</p>
              <Link to="/">
                <button style={{ marginTop: 16, padding: "12px 28px", background: "#2d8c5e", color: "white", border: "none", borderRadius: 8, fontWeight: 700, cursor: "pointer" }}>
                  Continue Shopping
                </button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                {[
                  { name: "name",     label: "Your Name",    type: "text",   required: true },
                  { name: "company",  label: "Company Name", type: "text",   required: true },
                  { name: "email",    label: "Work Email",   type: "email",  required: true },
                  { name: "quantity", label: "Quantity Needed", type: "number", required: true },
                ].map((f) => (
                  <div key={f.name}>
                    <label style={{ display: "block", fontWeight: 600, marginBottom: 6, color: "#333", fontSize: 14 }}>{f.label}</label>
                    <input
                      type={f.type} name={f.name} required={f.required}
                      value={formData[f.name]}
                      onChange={handleChange}
                      style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #c8e6c9", borderRadius: 8, fontSize: 14, outline: "none", boxSizing: "border-box" }}
                    />
                  </div>
                ))}
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontWeight: 600, marginBottom: 6, color: "#333", fontSize: 14 }}>Preferred Bundle</label>
                <select name="bundle" value={formData.bundle} onChange={handleChange}
                  style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #c8e6c9", borderRadius: 8, fontSize: 14, outline: "none" }}>
                  <option value="">Select a bundle…</option>
                  {BUNDLES.map((b) => <option key={b.name} value={b.name}>{b.emoji} {b.name}</option>)}
                  <option value="custom">Custom Bundle</option>
                </select>
              </div>
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: "block", fontWeight: 600, marginBottom: 6, color: "#333", fontSize: 14 }}>Message (optional)</label>
                <textarea name="message" value={formData.message} onChange={handleChange} rows={4}
                  placeholder="Tell us about your requirements, budget, or any special requests…"
                  style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #c8e6c9", borderRadius: 8, fontSize: 14, outline: "none", resize: "vertical", boxSizing: "border-box" }} />
              </div>
              <button type="submit" style={{
                width: "100%", padding: "14px", background: "#2d8c5e", color: "white",
                border: "none", borderRadius: 8, fontWeight: 700, cursor: "pointer", fontSize: 16,
              }}>
                🌿 Submit Quote Request
              </button>
            </form>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CorporateGiftingPage;
