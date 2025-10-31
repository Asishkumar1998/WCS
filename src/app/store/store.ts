import { configureStore } from "@reduxjs/toolkit";
import uiReducer from "./features/uiSlice";
import formsReducer from "./features/formsSlice";
import userReducer from "./features/userSlice";

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    userData: userReducer,
    formsData: formsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
