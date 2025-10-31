import { configureStore } from "@reduxjs/toolkit";
import uiReducer from "./features/uiSlice";
import formsReducer from "./features/formsSlice";

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    formsData: formsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
