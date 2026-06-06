import { createSlice } from "@reduxjs/toolkit";

const sustainabilitySlice = createSlice({
  name: "sustainability",
  initialState: {
    dashboard: null,       // full dashboard payload
    isFetching: false,
    error: false,
    lastFetched: null,     // timestamp for cache invalidation
  },
  reducers: {
    fetchDashboardStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    fetchDashboardSuccess: (state, action) => {
      state.isFetching = false;
      state.dashboard = action.payload;
      state.lastFetched = Date.now();
    },
    fetchDashboardFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },
    updateCreditsLocally: (state, action) => {
      // Optimistic update after redemption
      if (state.dashboard) {
        state.dashboard.greenCredits = Math.max(
          0,
          (state.dashboard.greenCredits || 0) - action.payload
        );
      }
    },
    clearDashboard: (state) => {
      state.dashboard = null;
      state.lastFetched = null;
    },
  },
});

export const {
  fetchDashboardStart,
  fetchDashboardSuccess,
  fetchDashboardFailure,
  updateCreditsLocally,
  clearDashboard,
} = sustainabilitySlice.actions;

export default sustainabilitySlice.reducer;
