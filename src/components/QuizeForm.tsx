import { LANG } from "@/constants/others";
import { Timer, Clock, CheckCircle, AlertCircle, ChevronRight } from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";

const QuizForm = ({
  quizQuestion = [],
  title = "Quiz Title",
  handleQuizSubmit = (value: any) => {},
}: any) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [LA, setLA] = useState(LANG.EN);
  const [selectedChoiceId, setSelectedChoiceId] = useState(null);
  const [quizPayload, setQuizPayload] = useState([]);
  const [timeLeft, setTimeLeft] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const timerRef = useRef();
  const totalQuestions = quizQuestion.length;
  const currentQuestion = quizQuestion[currentQuestionIndex];
  const answeredQuestions = currentQuestionIndex;
  const progressPercentage = (answeredQuestions / totalQuestions) * 100;

  const onToggle = () => {
    setLA((prv) => (prv === LANG.EN ? LANG.TA : LANG.EN));
  };

  const goToNextQuestion = useCallback(
    (choosedId) => {
      clearTimeout(timerRef.current);

      const newEntry = {
        question_id: currentQuestion.id,
        choice_id: choosedId,
      };

      setQuizPayload((prevPayload) => [...prevPayload, newEntry]);

      if (currentQuestionIndex < totalQuestions - 1) {
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
        setSelectedChoiceId(null);
      } else {
        setIsSubmitting(true);
        let payload = [...quizPayload, newEntry];
        handleQuizSubmit(payload);
      }
    },
    [currentQuestionIndex, currentQuestion, totalQuestions, quizPayload, handleQuizSubmit]
  );

  const onSubmit = () => {
    goToNextQuestion(selectedChoiceId);
  };

  useEffect(() => {
    if (!currentQuestion) return;

    const timeLimit = currentQuestion.timeLimit;
    setTimeLeft(timeLimit);

    const countdownInterval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(countdownInterval);
          goToNextQuestion(null);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => {
      clearInterval(countdownInterval);
    };
  }, [currentQuestionIndex, currentQuestion, goToNextQuestion]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleChoiceChange = (event) => {
    setSelectedChoiceId(parseInt(event.target.value));
  };

  if (!currentQuestion)
    return (
      <div className="min-h-screen bg-gray-50 safe-area-inset-bottom pb-20 flex items-center justify-center px-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-600">Loading quiz or quiz is empty...</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 safe-area-inset-bottom pb-20">
      {/* Header with Progress */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 safe-area-inset-top">
        <div className="flex justify-between items-center mb-3">
          <h1 className="text-xl font-bold text-gray-900">{title}</h1>
          <div className="flex items-center bg-blue-50 px-3 py-1 rounded-full">
            <span className="text-sm font-medium text-blue-600">
              {answeredQuestions + 1}/{totalQuestions}
            </span>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Question Card */}
      <div className="px-6 mt-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Question Header with Timer */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-100">
            <div className="flex items-start justify-between">
              <div className="flex-1 pr-4">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                    {currentQuestionIndex + 1}
                  </div>
                  <span className="text-sm font-medium text-blue-600">Question</span>
                </div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {currentQuestion?.question}
                </h2>
              </div>
              
              {/* Timer */}
              <div
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl shadow-sm flex-shrink-0 transition-colors ${
                  timeLeft <= 5
                    ? "text-red-600 bg-red-100 border border-red-200"
                    : timeLeft <= 10
                    ? "text-orange-600 bg-orange-100 border border-orange-200"
                    : "text-green-600 bg-green-100 border border-green-200"
                }`}
              >
                <Timer className="w-5 h-5" />
                <span className="font-mono text-lg font-bold">
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="p-6 space-y-3">
            {currentQuestion.choices.map((choice, idx) => (
              <label
                key={choice.id}
                className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                  selectedChoiceId === choice.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <div className="relative">
                  <input
                    type="radio"
                    name={`question-${currentQuestion.id}`}
                    value={choice.id}
                    checked={selectedChoiceId === choice.id}
                    onChange={handleChoiceChange}
                    className="sr-only"
                  />
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      selectedChoiceId === choice.id
                        ? "border-blue-500"
                        : "border-gray-300"
                    }`}
                  >
                    {selectedChoiceId === choice.id && (
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                </div>
                <span className="ml-4 text-base font-medium text-gray-900 flex-1">
                  {choice.choise}
                </span>
                {selectedChoiceId === choice.id && (
                  <CheckCircle className="w-5 h-5 text-blue-500" />
                )}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="px-6 mt-6 mb-6">
        <button
          onClick={onSubmit}
          disabled={isSubmitting}
          className={`w-full flex items-center justify-center px-6 py-4 rounded-xl font-semibold shadow-md transition-all transform active:scale-95 ${
            isSubmitting
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
          }`}
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
              Submitting...
            </>
          ) : (
            <>
              {currentQuestionIndex === totalQuestions - 1
                ? "Submit Quiz"
                : "Next Question"}
              <ChevronRight className="w-5 h-5 ml-2" />
            </>
          )}
        </button>
      </div>

      {/* Instructions */}
      <div className="px-6 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Quiz Instructions:</p>
              <ul className="space-y-1 text-blue-700">
                <li>• Select the best answer for each question</li>
                <li>• You have {currentQuestion.timeLimit} seconds for this question</li>
                <li>• Unanswered questions will be skipped when time runs out</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizForm;