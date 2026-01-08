import React, { useState, useEffect } from "react";
import { useData } from "@/context/DataContext";
import { X, Plus, Trash2, Clock, DollarSign } from "lucide-react";

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  video?: any;
}

export default function QuizModal({ isOpen, onClose, video }: QuizModalProps) {
  const { addQuiz, updateQuiz, quizzes } = useData();
  const [questions, setQuestions] = useState([
    {
      id: Date.now().toString(),
      questionEn: "",
      questionTa: "",
      choices: [
        { id: "1", textEn: "", textTa: "", isCorrect: false },
        { id: "2", textEn: "", textTa: "", isCorrect: false },
      ],
      timeLimit: 30,
    },
  ]);
  const [earnings, setEarnings] = useState({
    promotor: 10,
    promotor1: 15,
    promotor2: 20,
    promotor3: 25,
    promotor4: 30,
  });

  const existingQuiz = quizzes.find((q) => q.videoId === video?.id);

  useEffect(() => {
    if (existingQuiz) {
      setQuestions(existingQuiz.questions);
      setEarnings(existingQuiz.earnings);
    } else {
      setQuestions([
        {
          id: Date.now().toString(),
          questionEn: "",
          questionTa: "",
          choices: [
            { id: "1", textEn: "", textTa: "", isCorrect: false },
            { id: "2", textEn: "", textTa: "", isCorrect: false },
          ],
          timeLimit: 30,
        },
      ]);
      setEarnings({
        promotor: 10,
        promotor1: 15,
        promotor2: 20,
        promotor3: 25,
        promotor4: 30,
      });
    }
  }, [existingQuiz, isOpen]);

  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        questionEn: "",
        questionTa: "",
        choices: [
          { id: "1", textEn: "", textTa: "", isCorrect: false },
          { id: "2", textEn: "", textTa: "", isCorrect: false },
        ],
        timeLimit: 30,
      },
    ]);
  };

  const removeQuestion = (questionId: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== questionId));
  };

  const updateQuestion = (questionId: string, field: string, value: any) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === questionId ? { ...q, [field]: value } : q))
    );
  };

  const addChoice = (questionId: string) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? {
              ...q,
              choices: [
                ...q.choices,
                {
                  id: Date.now().toString(),
                  textEn: "",
                  textTa: "",
                  isCorrect: false,
                },
              ],
            }
          : q
      )
    );
  };

  const removeChoice = (questionId: string, choiceId: string) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? {
              ...q,
              choices: q.choices.filter((c) => c.id !== choiceId),
            }
          : q
      )
    );
  };

  const updateChoice = (
    questionId: string,
    choiceId: string,
    field: string,
    value: any
  ) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? {
              ...q,
              choices: q.choices.map((c) =>
                c.id === choiceId ? { ...c, [field]: value } : c
              ),
            }
          : q
      )
    );
  };

  const setCorrectAnswer = (questionId: string, choiceId: string) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? {
              ...q,
              choices: q.choices.map((c) => ({
                ...c,
                isCorrect: c.id === choiceId,
              })),
            }
          : q
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate that each question has at least one correct answer
    const isValid = questions.every(
      (q) =>
        q.questionEn.trim() &&
        q.questionTa.trim() &&
        q.choices.length >= 2 &&
        q.choices.some((c) => c.isCorrect) &&
        q.choices.every((c) => c.textEn.trim() && c.textTa.trim())
    );

    if (!isValid) {
      alert(
        "Please fill all fields and ensure each question has at least one correct answer."
      );
      return;
    }

    const quizData = {
      videoId: video.id,
      questions,
      earnings,
    };

    if (existingQuiz) {
      updateQuiz(existingQuiz.id, quizData);
    } else {
      addQuiz(quizData);
    }

    onClose();
  };

  if (!isOpen || !video) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        ></div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {existingQuiz ? "Edit Quiz" : "Create Quiz"} for "
                  {video.title}"
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Create questions in both English and Tamil
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Earnings Settings */}
              {/* <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
                  <DollarSign className="w-5 h-5 mr-2" />
                  Earnings per Level
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {Object.entries(earnings).map(([level, amount]) => (
                    <div key={level}>
                      <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                        {level.replace("promotor", "Promotor ")}
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={amount}
                        onChange={(e) =>
                          setEarnings((prev) => ({
                            ...prev,
                            [level]: parseInt(e.target.value) || 0,
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  ))}
                </div>
              </div> */}

              {/* Questions */}
              <div className="space-y-6">
                {questions.map((question, questionIndex) => (
                  <div
                    key={question.id}
                    className="border border-gray-200 rounded-lg p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-md font-medium text-gray-900">
                        Question {questionIndex + 1}
                      </h4>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <input
                            type="number"
                            min="10"
                            max="300"
                            value={question.timeLimit}
                            onChange={(e) =>
                              updateQuestion(
                                question.id,
                                "timeLimit",
                                parseInt(e.target.value) || 30
                              )
                            }
                            className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                          <span className="text-sm text-gray-500">sec</span>
                        </div>
                        {questions.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeQuestion(question.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Question (English) *
                        </label>
                        <textarea
                          required
                          rows={3}
                          value={question.questionEn}
                          onChange={(e) =>
                            updateQuestion(
                              question.id,
                              "questionEn",
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter question in English"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Question (Tamil) *
                        </label>
                        <textarea
                          required
                          rows={3}
                          value={question.questionTa}
                          onChange={(e) =>
                            updateQuestion(
                              question.id,
                              "questionTa",
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="தமிழில் கேள்வியை உள்ளிடவும்"
                        />
                      </div>
                    </div>

                    {/* Choices */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-700">
                          Answer Choices
                        </label>
                        <button
                          type="button"
                          onClick={() => addChoice(question.id)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          + Add Choice
                        </button>
                      </div>

                      {question.choices.map((choice, choiceIndex) => (
                        <div
                          key={choice.id}
                          className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                        >
                          <input
                            type="radio"
                            name={`correct-${question.id}`}
                            checked={choice.isCorrect}
                            onChange={() =>
                              setCorrectAnswer(question.id, choice.id)
                            }
                            className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                          />
                          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                            <input
                              type="text"
                              required
                              value={choice.textEn}
                              onChange={(e) =>
                                updateChoice(
                                  question.id,
                                  choice.id,
                                  "textEn",
                                  e.target.value
                                )
                              }
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder={`Choice ${
                                choiceIndex + 1
                              } (English)`}
                            />
                            <input
                              type="text"
                              required
                              value={choice.textTa}
                              onChange={(e) =>
                                updateChoice(
                                  question.id,
                                  choice.id,
                                  "textTa",
                                  e.target.value
                                )
                              }
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder={`விருப்பம் ${
                                choiceIndex + 1
                              } (தமிழ்)`}
                            />
                          </div>
                          {question.choices.length > 2 && (
                            <button
                              type="button"
                              onClick={() =>
                                removeChoice(question.id, choice.id)
                              }
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addQuestion}
                  className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors"
                >
                  <Plus className="w-5 h-5 mx-auto mb-1" />
                  Add Another Question
                </button>
              </div>

              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-green-600 to-yellow-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {existingQuiz ? "Update Quiz" : "Create Quiz"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
