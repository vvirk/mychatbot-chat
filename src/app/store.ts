import { configureStore } from "@reduxjs/toolkit";
import { chatReducer } from "../features/chat/chatSlice";
import { chatMiddleware } from "../features/chat/chatMiddleware";

export const store = configureStore({
  reducer: {
    chat: chatReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(chatMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;