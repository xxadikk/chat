import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { findChat, createChat, getChats, updateChat } from "../../api/chat";

export const getOrCreateChat = createAsyncThunk(
  "chats/getOrCreateChat",
  async ({ userId, otherId }) => {
    let chat = await findChat(userId, otherId);
    if (!chat) {
      chat = await createChat([userId, otherId]);
    }
    return chat;
  }
);

export const fetchChats = createAsyncThunk("chat/fetchChats", async () => {
  return await getChats();
});

export const patchChat = createAsyncThunk(
  "chats/patchChat",
  async ({ id, patch }) => {
    return await updateChat(id, patch);
  }
);

const chatsSlice = createSlice({
  name: "chats",
  initialState: {
    current: null,
    list: [],
    status: "idle",
    isDetailsOpen: false,
  },
  reducers: {
    setCurrent(state, action) {
      state.current = action.payload;
      state.isDetailsOpen = false;
    },
    toggleDetails(state, action) {
      state.isDetailsOpen =
        action.payload !== undefined ? action.payload : !state.isDetailsOpen;
    },
    setList(state, action) {
      state.list = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOrCreateChat.fulfilled, (state, action) => {
        state.current = action.payload;
      })
      .addCase(fetchChats.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(patchChat.fulfilled, (state, action) => {
        const updatedChat = action.payload;
        state.list = state.list.map((chat) =>
          chat.id === updatedChat.id ? updatedChat : chat
        );
        if (state.current?.id === updatedChat.id) {
          state.current = updatedChat;
        }
      });
  },
});

export const { setCurrent, setList, toggleDetails } = chatsSlice.actions;
export default chatsSlice.reducer;
