import React, { useEffect, useState } from "react";
import { Add, Remove, FavoriteBorder, Favorite } from "@material-ui/icons";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Newsletter from "../components/Newsletter";
import { useLocation } from "react-router-dom";
import { publicRequest } from "../requestMethods";
import { addProduct } from "../redux/cartRedux";
import { useDispatch, useSelector } from "react-redux";
import SustainabilityBadges from "../components/SustainabilityBadges";
import RelatedProducts from "../components/RelatedProducts";
import "./Product.css";

const Product = () => {
  const location  = useLocation();
  const id        = location.pathname.split("/")[2];
  const dispatch  = useDispatch();
  const currentUser = useSelector((s) => s.user.currentUser);

  const [product, setProduct]               = useState({});
  const [quantity, setQuantity]             = useState(1);
  const [color, setColor]                   = useState("");
  const [size, setSize]                     = useState("");
  const [educativeContent, setEducativeContent] = useState("");
  const [wished, setWished]                 = useState(false);
  const [wishLoading, setWishLoading]       = useState(false);
  const [addedMsg, setAddedMsg]             = useState(false);

  useEffect(() => {
    const getProduct = async () => {
      try {
        const res = await publicRequest.get("/products/find/" + id);
        setProduct(res.data);
        setColor(res.data.color?.[0] || "");
        setSize(res.data.size?.[0] || "");
      } catch {}
    };
    getProduct();
  }, [id]);

  useEffect(() => {
    const fetchEducativeContent = async () => {
      try {
        const res = await publicRequest.get("/educativecontent/textile");
        setEducativeContent(res.data[0]?.content || "");
      } catch {}
    };
    fetchEducativeContent();
  }, []);

  const handleQuantity = (type) => {
    if (type === "dec") { quantity > 1 && setQuantity(quantity - 1); }
    else setQuantity(quantity + 1);
  };

  const handleClick = () => {
    dispatch(addProduct({ ...product, quantity, color, size }));
    setAddedMsg(true);
    setTimeout(() => setAddedMsg(false), 2000);
  };

  const handleWishlist = async () => {
    if (!currentUser) return;
    setWishLoading(true);
    try {
      if (wished) {
        await publicRequest.delete(`/users/${currentUser._id}/wishlist/${product._id}`);
      } else {
        await publicRequest.post(`/users/${currentUser._id}/wishlist`, { productId: product._id });
      }
      setWished(!wished);
    } catch {}
    setWishLoading(false);
  };

  return (
    <div className="product-page">
      <Navbar />
      <div className="product-wrapper">
        {/* ── Image ── */}
        <div className="product-img-container">
          <img className="product-main-image" src={product.img} alt={product.title} />
        </div>

        {/* ── Info ── */}
        <div className="product-info-container">
          <h1 className="product-title">{product.title}</h1>

          {/* Sustainability Badges */}
          <div style={{ marginBottom: 12 }}>
            <SustainabilityBadges product={product} size="lg" />
          </div>

          <p className="product-desc">{product.desc}</p>
          {educativeContent && (
            <p className="product-desc educative-content">{educativeContent}</p>
          )}
          <p className="product-desc weight-text">
            Weight: <span className="green-text">{product.weight}g</span>
          </p>
          <p className="product-desc">
            Carbon Emission:{" "}
            <span className="carbon-percentage">{product.carbonEmissionPercentage}%</span>
          </p>
          {product.materials?.length > 0 && (
            <p className="product-desc">
              Materials:{" "}
              <span className="green-text">{product.materials.join(", ")}</span>
            </p>
          )}
          <div className="product-price"><p>${product.price}</p></div>

          <div className="product-filter-container">
            <div className="product-filter">
              <span className="product-filterTitle">Select Color</span>
              <div className="product-colors">
                {product.color?.map((c) => (
                  <div
                    key={c}
                    className="product-color"
                    style={{
                      backgroundColor: c,
                      outline: color === c ? "2px solid #2d8c5e" : "none",
                      outlineOffset: 2,
                    }}
                    onClick={() => setColor(c)}
                  />
                ))}
              </div>
            </div>
            <div className="product-filter">
              <span className="product-filterTitle">Select Size</span>
              <select
                className="product-size"
                value={size}
                onChange={(e) => setSize(e.target.value)}
              >
                {product.size?.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="product-add-container">
            <div className="product-amountContainer">
              <Remove onClick={() => handleQuantity("dec")} style={{ cursor: "pointer" }} />
              <span className="product-amount">{quantity}</span>
              <Add onClick={() => handleQuantity("inc")} style={{ cursor: "pointer" }} />
            </div>
            <button className="product-button" onClick={handleClick}>
              {addedMsg ? "✓ ADDED!" : "ADD TO CART"}
            </button>
            {currentUser && (
              <button
                onClick={handleWishlist}
                disabled={wishLoading}
                style={{
                  background: "none", border: "1.5px solid #e53935",
                  borderRadius: 8, padding: "8px 14px", cursor: "pointer",
                  color: wished ? "#e53935" : "#888", fontSize: 20, marginLeft: 8,
                  transition: "all 0.2s",
                }}
                title={wished ? "Remove from Wishlist" : "Add to Wishlist"}
              >
                {wished ? <Favorite style={{ color: "#e53935" }} /> : <FavoriteBorder />}
              </button>
            )}
          </div>
          {addedMsg && (
            <p style={{ color: "#2d8c5e", fontWeight: 600, marginTop: 8 }}>
              ✅ Added to cart!
            </p>
          )}
        </div>
      </div>

      {/* ── Related Products ── */}
      <RelatedProducts productId={id} />

      <Newsletter />
      <Footer />
    </div>
  );
};

export default Product;
