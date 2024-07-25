import { CompaniesResult, CompanyDetails } from "../Store/company/types";
import {
  CompaniesAllResponse,
  CompanyResponse,
  CreateCompanyFormData,
  UserResponse,
} from "../Types/api";
import api from "./api";

interface Company {
  company_name: string;
  company_title: string;
  company_description: string;
  company_city: string;
  company_phone: string;
  company_links: string[];
}

export const createCompany = (
  formData: CreateCompanyFormData
): Promise<void> => {
  return api.post("/company", {
    company_name: formData.company_name,
    is_visible: formData.is_visible,
  });
};

export const updateVisibility = (
  companyId: number,
  is_visible: boolean
): Promise<void> => {
  return api.put(`/company/${companyId}/update_visible/`, { is_visible });
};

export const updateCompany = (
  companyId: number,
  companyData: Company
): Promise<void> => {
  return api.put(`/company/${companyId}/update_info/`, companyData);
};

export const deleteCompany = (companyId: number): Promise<void> => {
  return api.delete(`/company/${companyId}/`);
};

export const getCompanyRequests = async (
  companyId: number
): Promise<UserResponse[]> => {
  return api
    .get(`/company/${companyId}/requests_list/`)
    .then((res) => res.data.result.users);
};

export const getCompanyInvitation = async (
  companyId: number
): Promise<UserResponse[]> => {
  return api
    .get(`/company/${companyId}/invites_list/`)
    .then((res) => res.data.result.users);
};

export const getCompanyMembers = async (
  companyId: number
): Promise<UserResponse[]> => {
  return api
    .get(`/company/${companyId}/members_list/`)
    .then((res) => res.data.result.users);
};

export const getCompanyQuizzes = (companyId: number) => {
  return api.get(`/company/${companyId}/quizzes_list/`);
};

export const getCompanyQuizzes = (companyId: number) => {
  return api.get(`/company/${companyId}/quizzes_list/`);
};

export const fetchCompanyByIdFromApi = async (
  company_id: number
): Promise<CompanyDetails> => {
  const { data } = await api.get<CompanyResponse>(`/company/${company_id}/`);
  return data.result;
};

export const fetchAllCompaniesFromApi = async (
  page: number,
  page_size: number
): Promise<CompaniesResult> => {
  const { data } = await api.get<CompaniesAllResponse>(`/companies/`, {
    params: { page, page_size },
  });
  return data.result;
};
