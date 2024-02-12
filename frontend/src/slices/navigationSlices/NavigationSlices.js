import { createSlice } from "@reduxjs/toolkit";

export const navigationSlice = createSlice({
  name: "navigation",
  initialState: {
    destination: null,
  },
  reducers: {
    intendedDestination: (state, action) => {
      state.destination = action.payload;
    },
  },
});

// Export actions
export const { intendedDestination } = navigationSlice.actions;

// Export reducer
export default navigationSlice.reducer;
