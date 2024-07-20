import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import api from "../../Api/api";
import { ReduxStatus } from "../../Types/enums";
import {
  CompaniesAllResponse,
  CompanyDetails,
  CompanyResponse,
  companyState,
  UsersResult,
} from "./types";

const initialState: companyState = {
  companies: [],
  fetchedById: [],
  pagination: null,
  companiesStatus: ReduxStatus.INIT,
  byIdStatus: ReduxStatus.INIT,
};

export const fetchAllCompanies = createAsyncThunk<
  UsersResult,
  { token: string; page: number; page_size: number }
>("company/fetchAllCompanies", async ({ token, page, page_size }) => {
  const { data } = await api.get<CompaniesAllResponse>(`/companies/`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { page, page_size },
  });
  return data.result;
});

export const fetchCompanyById = createAsyncThunk<
  CompanyDetails,
  { token: string; company_id: number }
>("user/fetchUserById", async ({ token, company_id }) => {
  const { data } = await api.get<CompanyResponse>(`/company/${company_id}/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data.result;
});

const companySlice = createSlice({
  name: "company",
  initialState,
  reducers: {
    setActiveCompanyPage(state, action) {
      if (state.pagination) {
        state.pagination = {
          ...state.pagination,
          current_page: action.payload,
        };
        state.companiesStatus = ReduxStatus.INIT;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAllCompanies.pending, (state) => {
      state.pagination = null;
      state.companies = [];
      state.companiesStatus = ReduxStatus.LOADING;
    });
    builder.addCase(fetchAllCompanies.fulfilled, (state, action) => {
      state.pagination = action.payload.pagination;
      state.companies = action.payload.companies;
      state.companiesStatus = ReduxStatus.SUCCESS;
    });
    builder.addCase(fetchAllCompanies.rejected, (state) => {
      state.pagination = null;
      state.companies = [];
      state.companiesStatus = ReduxStatus.ERROR;
    });

    builder.addCase(fetchCompanyById.fulfilled, (state, action) => {
      const companyIndex = state.fetchedById.findIndex(
        (company) => company.company_id === action.payload.company_id
      );
      if (companyIndex !== -1) {
        state.fetchedById[companyIndex] = action.payload;
      } else {
        state.fetchedById.push(action.payload);
      }
      state.byIdStatus = ReduxStatus.SUCCESS;
    });
    builder.addCase(fetchCompanyById.rejected, (state) => {
      state.byIdStatus = ReduxStatus.ERROR;
    });
  },
});

export const { setActiveCompanyPage } = companySlice.actions;
export default companySlice.reducer;
