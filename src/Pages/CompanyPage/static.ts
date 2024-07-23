interface CompanyFormData {
  company_name: string;
  company_title: string;
  company_description: string;
  company_city: string;
  company_phone: string;
  company_links: string;
}

interface CompanyFormField {
  label: string;
  id: keyof CompanyFormData;
  name: keyof CompanyFormData;
  type: string;
  required?: boolean;
}

export const updateCompanyFormFields: CompanyFormField[] = [
  {
    label: "Company name",
    id: "company_name",
    name: "company_name",
    type: "text",
    required: true,
  },
  {
    label: "Company title",
    id: "company_title",
    name: "company_title",
    type: "text",
  },
  {
    label: "Company description",
    id: "company_description",
    name: "company_description",
    type: "text",
  },
  {
    label: "Company city",
    id: "company_city",
    name: "company_city",
    type: "text",
  },
  {
    label: "Company phone",
    id: "company_phone",
    name: "company_phone",
    type: "text",
  },
  {
    label: "Company Links (comma separated)",
    id: "company_links",
    name: "company_links",
    type: "text",
  },
];
