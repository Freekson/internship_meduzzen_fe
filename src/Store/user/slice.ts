import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { ReduxStatus } from "../../Types/enums";
import { TUser, UsersResult, userState } from "./types";
import { TCompany } from "../../Types/types";
import {
  fetchCompaniesFromApi,
  fetchUserByIdFromApi,
  fetchUserFromApi,
  fetchUsersListFromApi,
} from "../../Api/user";

const tokenLS = localStorage.getItem("BearerToken");

const initialState: userState = {
  token: tokenLS ?? "",
  userData: null,
  usersList: null,
  fetchedById: [],
  companies: [],
  status: ReduxStatus.INIT,
  listStatus: ReduxStatus.INIT,
  fetchedByIdStatus: ReduxStatus.INIT,
  companiesStatus: ReduxStatus.INIT,
};

export const fetchUser = createAsyncThunk<TUser, string>(
  "user/fetchUser",
  async () => {
    const data = await fetchUserFromApi();
    return data;
  }
);

export const fetchUsersList = createAsyncThunk<
  UsersResult,
  { token: string; page: number; page_size: number }
>("user/fetchUsersList", async ({ page, page_size }) => {
  const data = await fetchUsersListFromApi(page, page_size);
  return data;
});

export const fetchUserById = createAsyncThunk<
  TUser,
  { token: string; user_id: number }
>("user/fetchUserById", async ({ user_id }) => {
  const data = await fetchUserByIdFromApi(user_id);
  return data;
});

export const fetchCompanies = createAsyncThunk<
  TCompany[],
  { token: string; user_id: number }
>("user/fetchCompanies", async ({ user_id }) => {
  const data = await fetchCompaniesFromApi(user_id);
  return data;
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
    setToken(state, action) {
      state.token = action.payload;
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

    builder.addCase(fetchCompanies.pending, (state) => {
      state.companies = [];
      state.companiesStatus = ReduxStatus.LOADING;
    });
    builder.addCase(fetchCompanies.fulfilled, (state, action) => {
      state.companies = action.payload;
      state.companiesStatus = ReduxStatus.SUCCESS;
    });
    builder.addCase(fetchCompanies.rejected, (state) => {
      state.companies = [];
      state.companiesStatus = ReduxStatus.ERROR;
    });
  },
});

export const { setActivePage, resetState, setToken } = userSlice.actions;
export default userSlice.reducer;
