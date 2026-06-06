import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { publicRequest } from "../requestMethods";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SustainabilityBadges from "../components/SustainabilityBadges";
import { addProduct } from "../redux/cartRedux";
// Sync wishlist items into Redux so the Navbar badge stays accurate
import { fetchWishlistSuccess } from "../redux/wishlistRedux";

const WishlistPage = () => {
  const currentUser = useSelector((s) => s.user.currentUser);
  const dispatch    = useDispatch();
  const history     = useHistory();

  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    if (!currentUser) { history.push("/login"); return; }
    setLoading(true);
    publicRequest
      .get(`/users/${currentUser._id}/wishlist`)
      .then((res) => {
        const items = res.data.wishlist || [];
        setWishlist(items);
        // Keep Redux wishlist slice in sync so Navbar badge count is correct
        dispatch(fetchWishlistSuccess(items));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [currentUser, history, dispatch]);

  const handleRemove = async (productId) => {
    try {
      const res = await publicRequest.delete(`/users/${currentUser._id}/wishlist/${productId}`);
      const updated = res.data.wishlist || [];
      setWishlist(updated);
      dispatch(fetchWishlistSuccess(updated));
    } catch {}
  };

  const handleAddToCart = (item) => {
    dispatch(addProduct({ ...item, quantity: 1, color: item.color?.[0] || "", size: item.size?.[0] || "" }));
  };

  return (
    <div>
      <Navbar />
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 20px", minHeight: "60vh" }}>
        <h1 style={{ color: "#1a3d2b", marginBottom: 8, fontSize: 28 }}>♥ My Wishlist</h1>
        <p style={{ color: "#666", marginBottom: 32 }}>
          Your saved eco-friendly products
        </p>

        {loading && <p style={{ color: "#888", textAlign: "center" }}>Loading wishlist…</p>}

        {!loading && wishlist.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <p style={{ fontSize: 48 }}>♡</p>
            <p style={{ color: "#888", fontSize: 16 }}>Your wishlist is empty.</p>
            <Link to="/" style={{ color: "#2d8c5e", fontWeight: 600, textDecoration: "none" }}>
              Explore eco products →
            </Link>
          </div>
        )}

        <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
          {wishlist.map((item) => (
            <div key={item._id} style={{
              width: 240, background: "white", borderRadius: 12,
              boxShadow: "0 2px 12px rgba(0,0,0,0.07)", overflow: "hidden",
            }}>
              <Link to={`/product/${item._id}`}>
                <img src={item.img} alt={item.title} style={{ width: "100%", height: 180, objectFit: "cover" }} />
              </Link>
              <div style={{ padding: "12px 14px" }}>
                <p style={{ margin: "0 0 4px", fontWeight: 600, fontSize: 14, color: "#1a3d2b" }}>{item.title}</p>
                <p style={{ margin: "0 0 8px", fontWeight: 700, color: "#2d8c5e" }}>${item.price}</p>
                <SustainabilityBadges product={item} size="sm" />
                <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                  <button
                    onClick={() => handleAddToCart(item)}
                    style={{
                      flex: 1, padding: "8px", background: "#2d8c5e", color: "white",
                      border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 12,
                    }}
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => handleRemove(item._id)}
                    style={{
                      padding: "8px 10px", background: "none", color: "#e53935",
                      border: "1.5px solid #e53935", borderRadius: 8, cursor: "pointer", fontSize: 14,
                    }}
                    title="Remove from wishlist"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default WishlistPage;
