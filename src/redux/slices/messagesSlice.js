import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getMessages, sendMessage as apiSendMessage } from "../../api/messages";

export const fetchMessages = createAsyncThunk(
  "messages/fetchMessages",
  async (chatId) => {
    return await getMessages(chatId);
  }
);

export const sendNewMessage = createAsyncThunk(
  "messages/sendNewMessage",
  async (msg) => {
    return await apiSendMessage(msg);
  }
);

const messagesSlice = createSlice({
  name: "messages",
  initialState: { list: [], status: "idle" },
  reducers: {
    pushLocal(state, action) {
      state.list.push(action.payload);
    },
    clear(state) {
      state.list = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(sendNewMessage.fulfilled, (state, action) => {
        state.list.push(action.payload);
      });
  },
});

export const { pushLocal, clear } = messagesSlice.actions;
export default messagesSlice.reducer;
