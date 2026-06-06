import { createSlice } from "@reduxjs/toolkit";

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    items: [],
    isFetching: false,
    error: false,
  },
  reducers: {
    fetchWishlistStart: (state) => { state.isFetching = true; state.error = false; },
    fetchWishlistSuccess: (state, action) => { state.isFetching = false; state.items = action.payload; },
    fetchWishlistFailure: (state) => { state.isFetching = false; state.error = true; },
    addToWishlistLocal: (state, action) => {
      if (!state.items.find((p) => p._id === action.payload._id)) {
        state.items.push(action.payload);
      }
    },
    removeFromWishlistLocal: (state, action) => {
      state.items = state.items.filter((p) => p._id !== action.payload);
    },
    clearWishlist: (state) => { state.items = []; },
  },
});

export const {
  fetchWishlistStart, fetchWishlistSuccess, fetchWishlistFailure,
  addToWishlistLocal, removeFromWishlistLocal, clearWishlist,
} = wishlistSlice.actions;
export default wishlistSlice.reducer;
