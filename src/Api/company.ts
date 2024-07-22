import { CompaniesResult, CompanyDetails } from "../Store/company/types";
import {
  CompaniesAllResponse,
  CompanyResponse,
  CreateCompanyFormData,
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

export const createCompany = (formData: CreateCompanyFormData) => {
  return api.post("/company", {
    company_name: formData.company_name,
    is_visible: formData.is_visible,
  });
};

export const updateVisibility = (companyId: number, is_visible: boolean) => {
  return api.put(`/company/${companyId}/update_visible/`, { is_visible });
};

export const updateCompany = (companyId: number, companyData: Company) => {
  return api.put(`/company/${companyId}/update_info/`, companyData);
};

export const deleteCompany = (companyId: number) => {
  return api.delete(`/company/${companyId}/`);
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

export const getCompanyRequests = (companyId: number) => {
  return api.get(`/company/${companyId}/requests_list/`);
};

export const getCompanyInvitation = (companyId: number) => {
  return api.get(`/company/${companyId}/invites_list/`);
};

export const getCompanyMembers = (companyId: number) => {
  return api.get(`/company/${companyId}/members_list/`);
};
export const fetchCompanyByIdFromApi = async (
  company_id: number
): Promise<CompanyDetails> => {
  const { data } = await api.get<CompanyResponse>(`/company/${company_id}/`);
  return data.result;
};
