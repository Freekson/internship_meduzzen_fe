import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ReduxStatus } from "../../Types/enums";
import { CompanyDetails, companyState, CompaniesResult } from "./types";
import {
  fetchAllCompaniesFromApi,
  fetchCompanyByIdFromApi,
} from "../../Api/company";

const initialState: companyState = {
  companies: [],
  fetchedById: [],
  pagination: null,
  companiesStatus: ReduxStatus.INIT,
  byIdStatus: ReduxStatus.INIT,
};

export const fetchAllCompanies = createAsyncThunk<
  CompaniesResult,
  { page: number; page_size: number }
>("company/fetchAllCompanies", async ({ page, page_size }) => {
  return fetchAllCompaniesFromApi(page, page_size);
});

export const fetchCompanyById = createAsyncThunk<
  CompanyDetails,
  { company_id: number }
>("company/fetchCompanyById", async ({ company_id }) => {
  return fetchCompanyByIdFromApi(company_id);
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

    builder.addCase(fetchCompanyById.pending, (state) => {
      state.byIdStatus = ReduxStatus.LOADING;
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
