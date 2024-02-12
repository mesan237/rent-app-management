import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./slices/apiSlices";
import authSliceReducer from "./slices/authSlice";
import snackbarReducer from "./slices/snackbar/snackbarSlice";
import navigationReducer from "./slices/navigationSlices/NavigationSlices";

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    login: authSliceReducer,
    snackbar: snackbarReducer,
    navigation: navigationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

export default store;
