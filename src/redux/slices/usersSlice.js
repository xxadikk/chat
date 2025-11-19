import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllUsers, updateUser } from "../../api/users";

export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  return await getAllUsers();
});

export const saveUser = createAsyncThunk(
  "users/saveUser",
  async ({ id, patch }) => {
    return await updateUser(id, patch);
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState: { list: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(saveUser.fulfilled, (state, action) => {
        state.list = state.list.map((u) =>
          u.id === action.payload.id ? action.payload : u
        );
      });
  },
});

export default usersSlice.reducer;
