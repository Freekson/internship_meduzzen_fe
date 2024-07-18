import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import api from "../../Api/api";
import { ReduxStatus } from "../../Types/enums";
import { TUser, UserResponse, userState } from "./types";

const tokenLS = localStorage.getItem("BearerToken");

const initialState: userState = {
  token: tokenLS ?? "",
  userData: null,
  status: ReduxStatus.INIT,
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
      state.status = ReduxStatus.LOADING;
    });
    builder.addCase(fetchUser.fulfilled, (state, action) => {
      state.userData = action.payload;
      state.status = ReduxStatus.SUCCESS;
    });
    builder.addCase(fetchUser.rejected, (state) => {
      state.userData = null;
      state.status = ReduxStatus.ERROR;
    });
  },
});
export default userSlice.reducer;
