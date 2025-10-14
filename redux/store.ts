import { configureStore } from "@reduxjs/toolkit";
import { alertsReducer } from "./states/alerts";

export const store = configureStore({
  reducer: {
    alerts: alertsReducer,
  },
});

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
