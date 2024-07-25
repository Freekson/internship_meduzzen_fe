import { QuizFormData } from "../Pages/CompanyPage/static";
import { IQuiz } from "../Types/types";
import api from "./api";

export const createQuiz = (quizData: IQuiz): Promise<number> => {
  return api
    .post("/quiz", {
      quiz_name: quizData.quiz_name,
      quiz_frequency: quizData.quiz_frequency,
      company_id: quizData.company_id,
      questions_list: quizData.questions_list,
    })
    .then((res) => res.data.result.quiz_id);
};

export const deleteQuiz = (quiz_id: number): Promise<void> => {
  return api.delete(`/quiz/${quiz_id}/`);
};

export const updateQuiz = (
  quiz_id: number,
  companyData: QuizFormData
): Promise<void> => {
  return api.put(`/quiz/${quiz_id}/update_info/`, companyData);
};
