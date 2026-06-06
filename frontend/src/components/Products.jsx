import { useEffect, useState } from "react";
import styled from "styled-components";
import Product from "./Product";
import axios from "axios";

const Container = styled.div`
  padding: 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const Products = ({ cat, filters, sort }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Fetch products — handles both {products:[]} and flat [] response shapes
  useEffect(() => {
    const getProducts = async () => {
      try {
        const url =
          cat && cat !== "all"
            ? "https://ecoshop-xoeh.onrender.com/api/products?category=" + cat
            : "https://ecoshop-xoeh.onrender.com/api/products";
        const res = await axios.get(url);
        // Support both response shapes: { products: [] } and []
        const data = Array.isArray(res.data)
          ? res.data
          : res.data.products || [];
        setProducts(data);
      } catch (err) {
        console.error("Products fetch error:", err);
      }
    };
    getProducts();
  }, [cat]);

  // Apply filters when products or filters change
  useEffect(() => {
    if (!cat) return;
    setFilteredProducts(
      products.filter((item) =>
        Object.entries(filters || {}).every(([key, value]) => {
          if (!value) return true;
          const field = item[key];
          if (Array.isArray(field)) return field.includes(value);
          return field === value;
        }),
      ),
    );
  }, [products, cat, filters]);

  // Apply sorting
  useEffect(() => {
    if (sort === "newest") {
      setFilteredProducts((prev) =>
        [...prev].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
      );
    } else if (sort === "asc") {
      setFilteredProducts((prev) =>
        [...prev].sort((a, b) => a.price - b.price),
      );
    } else if (sort === "desc") {
      setFilteredProducts((prev) =>
        [...prev].sort((a, b) => b.price - a.price),
      );
    }
  }, [sort]);

  const displayList = cat ? filteredProducts : products.slice(0, 8);

  return (
    <Container>
      {displayList.map((item) => (
        <Product item={item} key={item._id || item.id} />
      ))}
    </Container>
  );
};

export default Products;
