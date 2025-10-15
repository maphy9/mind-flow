import { Alert } from "@/types/alert";
import { createSlice } from "@reduxjs/toolkit";

const maxAlerts = 5;

const initialState: { alerts: Alert[] } = {
  alerts: [],
};

export const alertsState = createSlice({
  name: "alerts",
  initialState,
  reducers: {
    showAlert: (state, action: { payload: Alert }) => {
      if (state.alerts.length === maxAlerts) {
        return;
      }
      state.alerts.push(action.payload);
    },
    removeAlert: (state) => {
      if (state.alerts.length === 0) {
        return;
      }
      state.alerts.shift();
    },
  },
});

export const { showAlert, removeAlert } = alertsState.actions;
export const alertsReducer = alertsState.reducer;
