import { ReduxStatus } from "../../Types/enums";
import { TCompany, TPagination } from "../../Types/types";

export interface companyState {
  companies: TCompany[];
  fetchedById: CompanyDetails[];
  pagination: TPagination | null;
  companiesStatus: ReduxStatus;
  byIdStatus: ReduxStatus;
}

export type CompaniesResult = {
  companies: TCompany[];
  pagination: TPagination;
};

export interface CompanyOwner {
  user_id: number;
  user_email: string;
  user_firstname: string;
  user_lastname: string;
  user_avatar: string;
}

export interface CompanyDetails {
  company_id: number;
  company_name: string;
  company_title: string;
  company_avatar: string;
  is_visible: boolean;
  company_description: string;
  company_city: string;
  company_phone: string;
  company_links: string[];
  company_owner: CompanyOwner;
}
