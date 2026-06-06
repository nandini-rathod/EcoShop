import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { Badge } from "@material-ui/core";
import { ShoppingCartOutlined, EcoOutlined, SearchOutlined, CloseOutlined } from "@material-ui/icons";
import { Link, useHistory } from "react-router-dom";
import "./Navbar.css";
import logo from "./logo.png";

const Navbar = () => {
  const quantity      = useSelector((state) => state.cart.quantity);
  const currentUser   = useSelector((state) => state.user.currentUser);
  const greenCredits  = useSelector((state) => state.user.currentUser?.greenCredits);
  const history       = useHistory();

  const [searchOpen, setSearchOpen]   = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef(null);

  // Close search bar when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      history.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") handleSearch(e);
    if (e.key === "Escape") setSearchOpen(false);
  };

  return (
    <div className="navbar-container">
      {/* ── Logo ── */}
      <div className="logo-wrapper">
        <Link to="/" style={{ display: "flex", alignItems: "center", textDecoration: "none", color: "inherit" }}>
          <img src={logo} alt="EcoShop Logo" className="nav-logo-image" />
          <div className="header-text-wrapper">
            <h1 className="header-text">EcoShop</h1>
          </div>
        </Link>
      </div>

      {/* ── Nav Links ── */}
      <div className="nav-links">
        <Link to="/products/all" className="nav-link-a">
          <div className="nav-link">Shop</div>
        </Link>
        <Link to="/shop-by-values" className="nav-link-a">
          <div className="nav-link">Shop by Values</div>
        </Link>
        <Link to="/rewards" className="nav-link-a">
          <div className="nav-link">Rewards</div>
        </Link>
        <Link to="/corporate-gifting" className="nav-link-a">
          <div className="nav-link">Corporate Gifting</div>
        </Link>
      </div>

      {/* ── Right: Search + Credits + Cart ── */}
      <div className="search-bar" ref={searchRef}>
        {/* Search */}
        {searchOpen ? (
          <div className="nav-search-expanded">
            <input
              autoFocus
              type="text"
              placeholder="Search products..."
              className="search-input nav-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
            />
            <button className="nav-search-btn" onClick={handleSearch} title="Search">
              <SearchOutlined style={{ fontSize: 20 }} />
            </button>
            <button className="nav-search-close" onClick={() => setSearchOpen(false)} title="Close">
              <CloseOutlined style={{ fontSize: 18 }} />
            </button>
          </div>
        ) : (
          <button className="nav-search-icon-btn" onClick={() => setSearchOpen(true)} title="Search">
            <SearchOutlined style={{ color: "white", fontSize: 24 }} />
          </button>
        )}

        {/* Green Credits badge → Rewards page */}
        {currentUser && (
          <Link to="/rewards" className="nav-eco-link" title="My Rewards">
            <div className="nav-eco-badge">
              <EcoOutlined style={{ color: "#2d8c5e", fontSize: 22 }} />
              {greenCredits > 0 && (
                <span className="nav-credits-pill">✦ {greenCredits}</span>
              )}
            </div>
          </Link>
        )}

        {/* Dashboard link */}
        {currentUser && (
          <Link to="/dashboard" className="nav-dash-link" title="My Eco Dashboard">
            🌍
          </Link>
        )}

        {/* Cart */}
        <Link to="/cart">
          <Badge badgeContent={quantity} color="primary" overlap="rectangular">
            <ShoppingCartOutlined style={{ color: "white", fontSize: 32, marginLeft: "10px" }} />
          </Badge>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
