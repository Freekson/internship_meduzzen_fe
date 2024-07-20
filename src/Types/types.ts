export type TCompany = {
  company_id: number;
  company_name: string;
  company_title: string;
  company_avatar: string;
  is_visible: boolean;
  action_id: number;
  action: string;
};

export type TPagination = {
  current_page: number;
  total_page: number;
  total_results: number;
};
