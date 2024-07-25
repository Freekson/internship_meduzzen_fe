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

interface QuizUser {
  user_id: number;
  user_email: string;
  user_firstname: string;
  user_lastname: string;
  user_avatar: string;
}
export interface IFullQuiz {
  quiz_id: number;
  quiz_name: string;
  quiz_title: string;
  quiz_description: string;
  quiz_frequency: number;
  created_by: QuizUser;
  questions_list: {
    question_id: number;
    question_text: string;
    question_answers: string[];
  }[];
}
