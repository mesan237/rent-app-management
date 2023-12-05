import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./slices/apiSlices";
import authSliceReducer from "./slices/authSlice";
import snackbarReducer from "./slices/snackbar/snackbarSlice";

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    login: authSliceReducer,
    snackbar: snackbarReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

export default store;
