import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import api from "../../Api/api";
import { Status } from "../../Types/enums";
import { TUser, UserResponse, userState } from "./types";

const tokenLS = localStorage.getItem("BearerToken");

const initialState: userState = {
  token: tokenLS ?? "",
  userData: null,
  status: Status.INIT,
};

export const fetchUser = createAsyncThunk<TUser, { token: string }>(
  "user/fetchUser",
  async ({ token }) => {
    const { data } = await api.get<UserResponse>(`/auth/me/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data.result;
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUser.pending, (state) => {
      state.userData = null;
      state.status = Status.LOADING;
    });
    builder.addCase(fetchUser.fulfilled, (state, action) => {
      state.userData = action.payload;
      state.status = Status.SUCCESS;
    });
    builder.addCase(fetchUser.rejected, (state) => {
      state.userData = null;
      state.status = Status.ERROR;
    });
  },
});
export default userSlice.reducer;
