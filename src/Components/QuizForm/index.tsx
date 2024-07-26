import React, { useState } from "react";
import styles from "./QuizForm.module.scss";
import InputLabel from "../InputLabel";
import Button from "../Button";
import { IQuiz, TQuestion } from "../../Types/types";

interface QuizFormProps {
  onSubmit: (quiz: IQuiz) => void;
  onClose: () => void;
  company_id: number;
}

const QuizForm: React.FC<QuizFormProps> = ({
  onSubmit,
  onClose,
  company_id,
}) => {
  const [quizName, setQuizName] = useState("");
  const [quizFrequency, setQuizFrequency] = useState(0);
  const [questions, setQuestions] = useState<TQuestion[]>([
    {
      question_text: "",
      question_answers: ["", ""],
      question_correct_answer: 0,
    },
    {
      question_text: "",
      question_answers: ["", ""],
      question_correct_answer: 0,
    },
  ]);

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        question_text: "",
        question_answers: ["", ""],
        question_correct_answer: 0,
      },
    ]);
  };

  const handleRemoveQuestion = (index: number) => {
    if (questions.length > 2) {
      setQuestions(questions.filter((_, qIndex) => qIndex !== index));
    }
  };

  const handleAddOption = (index: number) => {
    const newQuestions = questions.slice();
    newQuestions[index].question_answers.push("");
    setQuestions(newQuestions);
  };

  const handleRemoveOption = (qIndex: number, oIndex: number) => {
    const newQuestions = questions.slice();
    if (newQuestions[qIndex].question_answers.length > 2) {
      newQuestions[qIndex].question_answers = newQuestions[
        qIndex
      ].question_answers.filter((_, optionIndex) => optionIndex !== oIndex);
      setQuestions(newQuestions);
    }
  };

  const handleQuestionChange = (index: number, value: string) => {
    const newQuestions = questions.slice();
    newQuestions[index].question_text = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (
    qIndex: number,
    oIndex: number,
    value: string
  ) => {
    const newQuestions = questions.slice();
    newQuestions[qIndex].question_answers[oIndex] = value;
    setQuestions(newQuestions);
  };

  const handleCorrectAnswerChange = (qIndex: number, oIndex: number) => {
    const newQuestions = questions.slice();
    newQuestions[qIndex].question_correct_answer = oIndex;
    setQuestions(newQuestions);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const quiz: IQuiz = {
      quiz_name: quizName,
      quiz_frequency: quizFrequency,
      company_id,
      questions_list: questions,
    };
    onSubmit(quiz);
    onClose();
  };

  return (
    <form className={styles.quizForm} onSubmit={handleSubmit}>
      <h2>Create a Quiz</h2>
      <InputLabel
        label="Quiz Name:"
        id="quiz_name"
        name="quiz_name"
        type="text"
        value={quizName}
        onChange={(e) => setQuizName(e.target.value)}
        required
      />
      <InputLabel
        label="Frequency (days):"
        id="frequency"
        name="frequency"
        type="number"
        value={String(quizFrequency)}
        onChange={(e) => setQuizFrequency(parseInt(e.target.value))}
        min={1}
      />
      {questions.map((question, qIndex) => (
        <div key={qIndex} className={styles.question}>
          <hr />
          <div className={styles.question__item}>
            <div>
              <InputLabel
                label={`Question ${qIndex + 1}:`}
                id={`question_${qIndex + 1}`}
                name={`question_${qIndex + 1}`}
                type="text"
                value={question.question_text}
                onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                required
              />
            </div>
            <Button
              text="&times;"
              type="button"
              variant="danger"
              title="Delete question"
              onClick={() => handleRemoveQuestion(qIndex)}
              disabled={questions.length <= 2}
            />
          </div>
          {question.question_answers.map((option, oIndex) => (
            <div key={oIndex} className={styles.option}>
              <div
                className={
                  oIndex === question.question_correct_answer
                    ? styles.correctOption
                    : ""
                }
              >
                <InputLabel
                  label={`Option ${oIndex + 1}:`}
                  id={`option_${qIndex + 1}_${oIndex + 1}`}
                  name={`option_${qIndex + 1}_${oIndex + 1}`}
                  type="text"
                  value={option}
                  onChange={(e) =>
                    handleOptionChange(qIndex, oIndex, e.target.value)
                  }
                  required
                />
              </div>
              <Button
                text="✔"
                type="button"
                variant="success"
                title="Set as correct"
                onClick={() => handleCorrectAnswerChange(qIndex, oIndex)}
                disabled={oIndex === question.question_correct_answer}
              />
              <Button
                text="&times;"
                type="button"
                variant="warning"
                title="Delete option"
                onClick={() => handleRemoveOption(qIndex, oIndex)}
                disabled={question.question_answers.length <= 2}
              />
            </div>
          ))}
          <div className={styles.option_bnt}>
            <Button
              text="Add Option"
              type="button"
              onClick={() => handleAddOption(qIndex)}
            />
          </div>
        </div>
      ))}
      <div className={styles.main_actions}>
        <Button text="Add Question" type="button" onClick={handleAddQuestion} />
        <Button text="Submit Quiz" type="submit" variant="success" />
      </div>
    </form>
  );
};

export default QuizForm;
