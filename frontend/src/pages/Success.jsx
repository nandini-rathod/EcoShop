import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";
import { userRequest, publicRequest } from "../requestMethods";
import {
  fetchDashboardStart,
  fetchDashboardSuccess,
  fetchDashboardFailure,
} from "../redux/sustainabilityRedux";

const Success = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const data = location.state?.stripeData;
  const cart = location.state?.cart;
  const currentUser = useSelector((state) => state.user.currentUser);
  const [orderId, setOrderId] = useState(null);
  const [impact, setImpact] = useState(null);

  useEffect(() => {
    const createOrder = async () => {
      try {
        const res = await userRequest.post("/orders", {
          userId: currentUser._id,
          products: cart.products.map((item) => ({
            productId: item._id,
            quantity: item._quantity || item.quantity || 1,
          })),
          amount: cart.total,
          sales: cart.total,
          cost: cart.total * 0.6,
          address: data.billing_details?.address || {},
        });
        setOrderId(res.data._id);

        // Capture impact data from the created order
        if (res.data.carbonSaved !== undefined) {
          setImpact({
            carbonSaved: res.data.carbonSaved,
            plasticSaved: res.data.plasticSaved,
            treesEquivalent: res.data.treesEquivalent,
            greenCreditsEarned: res.data.greenCreditsEarned,
          });
        }

        // Refresh sustainability dashboard cache
        if (currentUser?._id) {
          dispatch(fetchDashboardStart());
          try {
            const dashRes = await publicRequest.get(
              `/sustainability/dashboard/${currentUser._id}`
            );
            dispatch(fetchDashboardSuccess(dashRes.data));
          } catch {
            dispatch(fetchDashboardFailure());
          }
        }
      } catch (err) {
        console.error("Order creation error:", err);
      }
    };

    data && createOrder();
  }, [cart, data, currentUser, dispatch]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#f5faf6",
        padding: "24px",
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "16px",
          padding: "48px 40px",
          maxWidth: "520px",
          width: "100%",
          boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "56px", marginBottom: "16px" }}>🎉</div>
        <h2 style={{ color: "#1a3d2b", marginBottom: "8px" }}>
          {orderId ? "Order Placed Successfully!" : "Processing your order…"}
        </h2>
        {orderId && (
          <p style={{ color: "#666", fontSize: "14px", marginBottom: "24px" }}>
            Order ID: <strong>{orderId}</strong>
          </p>
        )}

        {/* Phase 1: Show eco-impact summary */}
        {impact && (
          <div
            style={{
              background: "linear-gradient(135deg, #e8f5e9, #c8e6c9)",
              borderRadius: "12px",
              padding: "20px",
              margin: "16px 0 24px",
              border: "1px solid #a5d6a7",
            }}
          >
            <p
              style={{
                fontWeight: "700",
                color: "#1a3d2b",
                margin: "0 0 12px",
                fontSize: "15px",
              }}
            >
              🌍 Your Eco-Impact This Purchase
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "10px",
              }}
            >
              <div style={{ background: "white", borderRadius: "8px", padding: "12px" }}>
                <p style={{ margin: 0, fontSize: "11px", color: "#888" }}>CO₂ SAVED</p>
                <p style={{ margin: 0, fontWeight: "700", color: "#2e7d32", fontSize: "18px" }}>
                  {impact.carbonSaved?.toFixed(2)} kg
                </p>
              </div>
              <div style={{ background: "white", borderRadius: "8px", padding: "12px" }}>
                <p style={{ margin: 0, fontSize: "11px", color: "#888" }}>PLASTIC AVOIDED</p>
                <p style={{ margin: 0, fontWeight: "700", color: "#1565c0", fontSize: "18px" }}>
                  {impact.plasticSaved?.toFixed(0)}g
                </p>
              </div>
              <div style={{ background: "white", borderRadius: "8px", padding: "12px" }}>
                <p style={{ margin: 0, fontSize: "11px", color: "#888" }}>TREE EQUIV.</p>
                <p style={{ margin: 0, fontWeight: "700", color: "#00695c", fontSize: "18px" }}>
                  {impact.treesEquivalent?.toFixed(1)} days 🌳
                </p>
              </div>
              <div style={{ background: "#fff8e1", borderRadius: "8px", padding: "12px" }}>
                <p style={{ margin: 0, fontSize: "11px", color: "#888" }}>CREDITS EARNED</p>
                <p style={{ margin: 0, fontWeight: "700", color: "#e65100", fontSize: "18px" }}>
                  ✦ {impact.greenCreditsEarned}
                </p>
              </div>
            </div>
          </div>
        )}

        <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
          <Link to="/">
            <button
              style={{
                padding: "12px 24px",
                background: "#2d8c5e",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontWeight: "600",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              Continue Shopping
            </button>
          </Link>
          {currentUser && (
            <Link to="/dashboard">
              <button
                style={{
                  padding: "12px 24px",
                  background: "white",
                  color: "#2d8c5e",
                  border: "2px solid #2d8c5e",
                  borderRadius: "8px",
                  fontWeight: "600",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                🌿 My Dashboard
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Success;
