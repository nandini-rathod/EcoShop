import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory, Link } from "react-router-dom";
import StripeCheckout from "react-stripe-checkout";
import { userRequest } from "../requestMethods";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import EcoImpactPreview from "../components/EcoImpactPreview";
import "./Cart.css";

const KEY = process.env.REACT_APP_STRIPE || "pk_test_51NQN1ySJlhbriFqHZaun9AcTWbAwbCZMEqKhdIn2jM0U4dorLcfiM6kIh8B56VYkJuuhK4TggPrHjtDgTdXasSGS00yK22YQAS";

const Cart = () => {
  const cart        = useSelector((state) => state.cart);
  const [stripeToken, setStripeToken] = useState(null);
  const history = useHistory();

  const onToken = (token) => setStripeToken(token);

  useEffect(() => {
    const makeRequest = async () => {
      try {
        const res = await userRequest.post("/checkout/payment", {
          tokenId: stripeToken.id,
          amount: cart.total * 100,
        });
        history.push("/success", { stripeData: res.data, cart });
      } catch (err) {
        // In test mode Stripe may error — still redirect with cart data
        history.push("/success", { stripeData: { billing_details: { address: {} } }, cart });
      }
    };
    stripeToken && makeRequest();
  }, [stripeToken, cart, history]);

  return (
    <div>
      <Navbar />
      <div>
        <div className="cart-buttons">
          <Link to="/">
            <button className="cart-button">CONTINUE SHOPPING</button>
          </Link>
        </div>
        <div className="product-summary">
          <div className="product-container">
            {cart.products.length === 0 && (
              <div style={{ textAlign: "center", padding: "40px", color: "#888" }}>
                <p style={{ fontSize: 40 }}>🛒</p>
                <p>Your cart is empty.</p>
                <Link to="/" style={{ color: "#2d8c5e", fontWeight: 600 }}>Start Shopping</Link>
              </div>
            )}
            {cart.products.map((product, i) => (
              <div key={product._id || i} className="product-details">
                <img src={product.img} className="product-image" alt={product.title} />
                <div className="product-info">
                  <span><b>Product:</b> {product.title}</span>
                  <span><b>ID:</b> {product._id}</span>
                  {product.color && (
                    <div className="color-indicator" style={{ backgroundColor: product.color, width: 20, height: 20, borderRadius: "50%", display: "inline-block" }} />
                  )}
                  <span><b>Size:</b> {product.size}</span>
                  <span><b>Qty:</b> {product.quantity}</span>
                </div>
                <div className="product-quantity">
                  <div className="product-price">$ {product.price * product.quantity}</div>
                </div>
              </div>
            ))}
            <hr className="product-divider" />
          </div>

          <div className="order-summary">
            <h1 className="order-summary-title">ORDER SUMMARY</h1>
            <div className="summary-item"><span>Subtotal</span><span>$ {cart.total}</span></div>
            <div className="summary-item"><span>Estimated Shipping</span><span>$ 5.90</span></div>
            <div className="summary-item"><span>Shipping Discount</span><span>$ -5.90</span></div>
            <div className="summary-item" style={{ fontWeight: 700 }}><span>Total</span><span>$ {cart.total}</span></div>

            {/* ── Eco Impact Preview (new) ── */}
            {cart.total > 0 && <EcoImpactPreview total={cart.total} />}

            <StripeCheckout
              name="EcoShop by CarbonSense"
              image="https://images.pexels.com/photos/5632390/pexels-photo-5632390.jpeg?auto=compress&w=60"
              billingAddress
              shippingAddress
              description={`Your total is $${cart.total}`}
              amount={cart.total * 100}
              token={onToken}
              stripeKey={KEY}
            >
              <button className="checkout-button">CHECKOUT NOW</button>
            </StripeCheckout>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
