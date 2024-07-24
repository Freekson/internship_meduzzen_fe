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

export type TQuestion = {
  question_text: string;
  question_answers: string[];
  question_correct_answer: number;
};

export interface IQuiz {
  quiz_name: string;
  quiz_frequency: number;
  company_id: number;
  questions_list: TQuestion[];
}
