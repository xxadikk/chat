import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { findUserByPhone, createUser } from "../../api/users";

export const loginByPhone = createAsyncThunk(
  "auth/loginByPhone",
  async (phone) => {
    let user = await findUserByPhone(phone);
    if (!user) {
      const name = `User ${phone.slice(-4)}`;
      user = await createUser({
        phone,
        name,
        avatar: `https://i.pravatar.cc/150?u=${phone}`,
        email: "",
        website: "",
        company: {
          name: "",
          catchPhrase: "",
          bs: "",
        },
      });
    }
    return user;
  }
);

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  status: "idle",
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      localStorage.removeItem("user");
    },
    setUser(state, action) {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginByPhone.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginByPhone.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(loginByPhone.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { logout, setUser } = authSlice.actions;
export default authSlice.reducer;
