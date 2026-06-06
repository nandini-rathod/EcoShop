import React from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";

import Home            from "./pages/Home";
import ProductList     from "./pages/ProductList";
import Product         from "./pages/Product";
import Cart            from "./pages/Cart";
import Success         from "./pages/Success";
import Dashboard       from "./pages/Dashboard";
import Login           from "./pages/Login";
import Register        from "./pages/Register";
import RewardsPage         from "./pages/RewardsPage";
import WishlistPage        from "./pages/WishlistPage";
import ShopByValuesPage    from "./pages/ShopByValuesPage";
import CorporateGiftingPage from "./pages/CorporateGiftingPage";
import SearchPage          from "./pages/SearchPage";

const App = () => {
  const user = useSelector((state) => state.user.currentUser);

  return (
    <Router>
      <Switch>
        {/* ── Existing routes (unchanged) ─────────────────────────── */}
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/products/:category">
          <ProductList />
        </Route>
        <Route path="/product/:id">
          <Product />
        </Route>
        <Route path="/cart">
          <Cart />
        </Route>
        <Route path="/success">
          <Success />
        </Route>
        <Route path="/dashboard">
          {user ? <Dashboard /> : <Redirect to="/login" />}
        </Route>
        <Route path="/login">
          {user ? <Redirect to="/" /> : <Login />}
        </Route>
        <Route path="/register">
          {user ? <Redirect to="/" /> : <Register />}
        </Route>

        {/* ── Phase 2: New routes ──────────────────────────────────── */}
        <Route path="/rewards">
          <RewardsPage />
        </Route>
        <Route path="/wishlist">
          {user ? <WishlistPage /> : <Redirect to="/login" />}
        </Route>
        <Route path="/shop-by-values">
          <ShopByValuesPage />
        </Route>
        <Route path="/corporate-gifting">
          <CorporateGiftingPage />
        </Route>
        <Route path="/search">
          <SearchPage />
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
