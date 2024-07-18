import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import api from "../../Api/api";
import { ReduxStatus } from "../../Types/enums";
import {
  TUser,
  UserResponse,
  UsersListResponse,
  UsersResult,
  userState,
} from "./types";

const tokenLS = localStorage.getItem("BearerToken");

const initialState: userState = {
  token: tokenLS ?? "",
  userData: null,
  usersList: null,
  fetchedById: [],
  status: ReduxStatus.INIT,
  listStatus: ReduxStatus.INIT,
  fetchedByIdStatus: ReduxStatus.INIT,
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

export const fetchUsersList = createAsyncThunk<
  UsersResult,
  { token: string; page: number; page_size: number }
>("user/fetchUsersList", async ({ token, page, page_size }) => {
  const { data } = await api.get<UsersListResponse>(`/users/`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { page, page_size },
  });
  return data.result;
});

export const fetchUserById = createAsyncThunk<
  TUser,
  { token: string; user_id: number }
>("user/fetchUserById", async ({ token, user_id }) => {
  const { data } = await api.get<UserResponse>(`/user/${user_id}/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data.result;
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setActivePage(state, action) {
      if (state.usersList) {
        state.usersList.pagination = {
          ...state.usersList.pagination,
          current_page: action.payload,
        };
        state.listStatus = ReduxStatus.INIT;
      }
    },
    resetState(state) {
      state.token = "";
      state.userData = initialState.userData;
      state.usersList = initialState.usersList;
      state.fetchedById = initialState.fetchedById;
      state.status = initialState.status;
      state.listStatus = initialState.listStatus;
      state.fetchedByIdStatus = initialState.fetchedByIdStatus;
    },
  },
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

    builder.addCase(fetchUsersList.pending, (state) => {
      state.usersList = null;
      state.listStatus = ReduxStatus.LOADING;
    });
    builder.addCase(fetchUsersList.fulfilled, (state, action) => {
      state.usersList = action.payload;
      state.listStatus = ReduxStatus.SUCCESS;
    });
    builder.addCase(fetchUsersList.rejected, (state) => {
      state.usersList = null;
      state.listStatus = ReduxStatus.ERROR;
    });

    builder.addCase(fetchUserById.pending, (state) => {
      state.fetchedByIdStatus = ReduxStatus.LOADING;
    });

    builder.addCase(fetchUserById.fulfilled, (state, action) => {
      const userExists = state.fetchedById.some(
        (user) => user.user_id === action.payload.user_id
      );
      if (!userExists) {
        state.fetchedById.push(action.payload);
      }
      state.fetchedByIdStatus = ReduxStatus.SUCCESS;
    });
    builder.addCase(fetchUserById.rejected, (state) => {
      state.fetchedByIdStatus = ReduxStatus.ERROR;
    });
  },
});

export const { setActivePage, resetState } = userSlice.actions;
export default userSlice.reducer;
