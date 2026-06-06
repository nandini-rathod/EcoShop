import React, { useState } from "react";
import { SearchOutlined, ShoppingCartOutlined } from "@material-ui/icons";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { addProduct } from "../redux/cartRedux";
import { publicRequest } from "../requestMethods";
import SustainabilityBadges from "./SustainabilityBadges";

/* ── wishlist heart that works when logged in ─────────────────────────── */
const WishlistHeart = ({ item }) => {
  const currentUser = useSelector((s) => s.user.currentUser);
  const [wished, setWished] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggle = async (e) => {
    e.preventDefault();
    if (!currentUser) return;
    setLoading(true);
    try {
      if (wished) {
        await publicRequest.delete(`/users/${currentUser._id}/wishlist/${item._id}`);
      } else {
        await publicRequest.post(`/users/${currentUser._id}/wishlist`, { productId: item._id });
      }
      setWished(!wished);
    } catch {}
    setLoading(false);
  };

  return (
    <Icon onClick={toggle} title={currentUser ? (wished ? "Remove from wishlist" : "Add to wishlist") : "Login to save"}>
      <span style={{ fontSize: 18, color: wished ? "#e53935" : "#555", opacity: loading ? 0.5 : 1 }}>
        {wished ? "♥" : "♡"}
      </span>
    </Icon>
  );
};

/* ── Styled components (preserved from original) ─────────────────────── */
const Info = styled.div`
  opacity: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0; left: 0;
  background-color: rgba(0,0,0,0.2);
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.5s ease;
  cursor: pointer;
  flex-direction: column;
  gap: 8px;
`;

const Container = styled.div`
  flex: 1;
  margin: 5px;
  min-width: 280px;
  height: 350px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5fbfd;
  position: relative;
  &:hover ${Info} { opacity: 1; }
`;

const Circle = styled.div`
  width: 200px; height: 200px;
  border-radius: 50%;
  background-color: white;
  position: absolute;
`;

const Image = styled.img`
  height: 75%;
  z-index: 2;
  object-fit: cover;
`;

const Icon = styled.div`
  width: 40px; height: 40px;
  border-radius: 50%;
  background-color: white;
  display: flex; align-items: center; justify-content: center;
  margin: 4px;
  transition: all 0.5s ease;
  cursor: pointer;
  &:hover { background-color: #e9f5f5; transform: scale(1.1); }
`;

const IconRow = styled.div`
  display: flex;
`;

const BadgeOverlay = styled.div`
  position: absolute;
  bottom: 8px; left: 8px;
  z-index: 4;
  display: flex;
  flex-direction: column;
  gap: 3px;
  max-width: calc(100% - 16px);
`;

const PriceTag = styled.div`
  position: absolute;
  top: 8px; right: 8px;
  background: rgba(45,140,94,0.9);
  color: white;
  font-weight: 700;
  font-size: 14px;
  padding: 4px 10px;
  border-radius: 12px;
  z-index: 4;
`;

const Product = ({ item }) => {
  const dispatch = useDispatch();

  const handleAddToCart = (e) => {
    e.preventDefault();
    dispatch(addProduct({ ...item, quantity: 1, color: item.color?.[0] || "", size: item.size?.[0] || "" }));
  };

  return (
    <Container>
      <Circle />
      <Image src={item.img} alt={item.title} />
      {item.price && <PriceTag>${item.price}</PriceTag>}
      <BadgeOverlay>
        <SustainabilityBadges product={item} size="sm" />
      </BadgeOverlay>
      <Info>
        <IconRow>
          <Icon onClick={handleAddToCart} title="Add to cart">
            <ShoppingCartOutlined />
          </Icon>
          <Link to={`/product/${item._id}`}>
            <Icon title="View details">
              <SearchOutlined />
            </Icon>
          </Link>
          <WishlistHeart item={item} />
        </IconRow>
        <div style={{ background: "rgba(255,255,255,0.9)", borderRadius: 8, padding: "4px 10px", fontSize: 13, fontWeight: 600, color: "#1a3d2b", maxWidth: "90%", textAlign: "center" }}>
          {item.title}
        </div>
      </Info>
    </Container>
  );
};

export default Product;
