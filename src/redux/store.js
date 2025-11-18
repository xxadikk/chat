import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "./slices/usersSlice";
import authReducer from "./slices/authSlice";
import messagesReducer from "./slices/messagesSlice";
import chatsReducer from "./slices/chatsSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    chats: chatsReducer,
    messages: messagesReducer,
  },
});

export default store;
