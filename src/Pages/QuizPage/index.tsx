import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./QuizPage.module.scss";
import { Helmet } from "react-helmet-async";
import Layout from "../../Components/Layout";
import { getQuiz, takeQuiz } from "../../Api/quizzes";
import { IFullQuiz } from "../../Types/types";
import { toast } from "react-toastify";
import { ThreeDots } from "react-loader-spinner";
import Button from "../../Components/Button";
import { IQuizData } from "../../Types/api";
import routes from "../../routes";

const QuizPage: React.FC = () => {
  const { id: quizId } = useParams<{ id: string }>();
  const [quiz, setQuiz] = useState<IFullQuiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<
    number | null
  >(null);
  const [answers, setAnswers] = useState<string[]>([]);
  const [quizFinished, setQuizFinished] = useState(false);
  const [result, setResult] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuiz = async () => {
      if (!quizId) return;
      try {
        const res = await getQuiz(parseInt(quizId));
        setQuiz(res);
      } catch (error) {
        toast.error("Error while fetching quiz");
      }
    };

    fetchQuiz();
  }, [quizId]);

  const handleStartQuiz = () => {
    setCurrentQuestionIndex(0);
    setAnswers(new Array(quiz?.questions_list.length || 0).fill(""));
    setQuizFinished(false);
  };

  const handleAnswerChange = (answerText: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex!] = answerText;
    setAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prevIndex) =>
      prevIndex !== null ? prevIndex + 1 : null
    );
  };

  const handlePreviousQuestion = () => {
    setCurrentQuestionIndex((prevIndex) =>
      prevIndex !== null && prevIndex > 0 ? prevIndex - 1 : prevIndex
    );
  };

  const handleFinishQuiz = async () => {
    try {
      if (!quiz) {
        toast.error("Quiz data is not available.");
        return;
      }
      const answersData: IQuizData = quiz.questions_list.reduce(
        (acc, question, index) => {
          const answer = answers[index] || "";
          acc[question.question_id] = answer;
          return acc;
        },
        {} as IQuizData
      );

      if (Object.values(answersData).includes("")) {
        toast.error("Please answer all questions before finishing the quiz.");
        return;
      }

      const res = await takeQuiz(quiz.quiz_id, answersData);
      setResult(res.result_score);
      toast.success(`Quiz finished! Your score: ${res.result_score}`);
      setQuizFinished(true);
    } catch (error) {
      toast.error("Error while finishing quiz");
    }
  };

  if (!quiz) {
    return (
      <div className={styles.loading}>
        <ThreeDots
          height="80"
          width="80"
          radius="9"
          color="#fb791b"
          ariaLabel="three-dots-loading"
          wrapperStyle={{}}
          visible={true}
        />
      </div>
    );
  }

  const currentQuestion =
    currentQuestionIndex !== null
      ? quiz.questions_list[currentQuestionIndex]
      : null;

  return (
    <Layout>
      <Helmet>
        <title>{quiz.quiz_name}</title>
      </Helmet>
      <div className={styles.quizPage}>
        {quizFinished ? (
          <div className={styles.quizFinished}>
            <h1>Congratulations!</h1>
            <p>You have completed the test. Your score: {result}</p>
            <Button
              text="Go back"
              type="button"
              onClick={() => navigate(routes.companyProfile)}
              variant="primary"
            />
          </div>
        ) : currentQuestionIndex === null ? (
          <div className={styles.quizInfo}>
            <h1>{quiz.quiz_name}</h1>
            <h2>{quiz.quiz_title}</h2>
            <p>{quiz.quiz_description}</p>
            <Button
              text="Start Quiz"
              type="button"
              onClick={handleStartQuiz}
              variant="success"
            />
          </div>
        ) : (
          <div className={styles.questionSection}>
            <h2>{currentQuestion!.question_text}</h2>
            <ul>
              {currentQuestion!.question_answers.map((answer, index) => (
                <li key={index} className={styles.answerOption}>
                  <input
                    className={styles.input}
                    type="radio"
                    name={`question_${currentQuestion!.question_id}`}
                    id={`answer_${index}`}
                    checked={answers[currentQuestionIndex] === answer}
                    onChange={() => handleAnswerChange(answer)}
                  />
                  <label htmlFor={`answer_${index}`}>{answer}</label>
                </li>
              ))}
            </ul>
            <div className={styles.navigationButtons}>
              {currentQuestionIndex > 0 && (
                <Button
                  text="Previous Question"
                  type="button"
                  variant="warning"
                  onClick={handlePreviousQuestion}
                />
              )}
              {currentQuestionIndex < quiz.questions_list.length - 1 ? (
                <Button
                  text="Next Question"
                  type="button"
                  onClick={handleNextQuestion}
                />
              ) : (
                <Button
                  text="Finish Quiz"
                  type="button"
                  variant="danger"
                  onClick={handleFinishQuiz}
                  title="You must answer all questions before finishing the test"
                  disabled={answers.includes("")}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default QuizPage;
