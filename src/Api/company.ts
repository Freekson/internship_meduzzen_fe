import { CreateCompanyFormData } from "../Types/api";
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
