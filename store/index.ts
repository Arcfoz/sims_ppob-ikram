import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import userReducer from "./slices/userSlice";
import informationReducer from "./slices/informationSlice";
import transactionReducer from "./slices/transactionSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    information: informationReducer,
    transaction: transactionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
