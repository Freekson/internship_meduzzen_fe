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

export interface QuizFormData {
  quiz_name: string;
  quiz_title: string;
  quiz_description: string;
  quiz_frequency: number;
}

interface QuizFormField {
  label: string;
  id: keyof QuizFormData;
  name: keyof QuizFormData;
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

export const quizFormFields: QuizFormField[] = [
  {
    label: "Quiz Name",
    id: "quiz_name",
    name: "quiz_name",
    type: "text",
    required: true,
  },
  {
    label: "Quiz Title",
    id: "quiz_title",
    name: "quiz_title",
    type: "text",
  },
  {
    label: "Quiz Description",
    id: "quiz_description",
    name: "quiz_description",
    type: "text",
  },
];
