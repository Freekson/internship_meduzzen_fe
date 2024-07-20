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

export const createCompany = (
  formData: CreateCompanyFormData,
  token: string
) => {
  return api.post(
    "/company",
    {
      company_name: formData.company_name,
      is_visible: formData.is_visible,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const updateVisibility = (
  companyId: number,
  is_visible: boolean,
  token: string
) => {
  return api.put(
    `/company/${companyId}/update_visible/`,
    { is_visible },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const updateCompany = (
  companyId: number,
  companyData: Company,
  token: string
) => {
  return api.put(`/company/${companyId}/update_info/`, companyData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteCompany = (companyId: number, token: string) => {
  return api.delete(`/company/${companyId}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
