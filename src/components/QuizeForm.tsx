import { LANG } from "@/constants/others"; // Assuming this is defined
import { Timer } from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";

// --- Mock Data/Constants for Functionality (Replace with actual data) ---
// const LANG = { EN: 'EN', TA: 'TA' };
// const DUMMY_QUIZ_QUESTION = [
//   { id: 1, questionEn: "Q1 Text EN", questionTa: "Q1 Text TA", timeLimit: 15, choices: [{ id: 101, textEn: "A", textTa: "அ" }, { id: 102, textEn: "B", textTa: "ஆ" }] },
//   { id: 2, questionEn: "Q2 Text EN", questionTa: "Q2 Text TA", timeLimit: 10, choices: [{ id: 201, textEn: "C", textTa: "இ" }, { id: 202, textEn: "D", textTa: "ஈ" }] },
//   // ... more questions
// ];
// const QuizForm = ({ quizQuestion = DUMMY_QUIZ_QUESTION, title = "Quiz Title" }) => {
// --- END Mock Data ---

const QuizForm = ({
  quizQuestion = [],
  title = "Quiz Title",
  handleQuizSubmit = (value: any) => {},
}: any) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Use 0-based index
  const [LA, setLA] = useState(LANG.EN);
  const [selectedChoiceId, setSelectedChoiceId] = useState(null);
  const [quizPayload, setQuizPayload] = useState([]);
  const [timeLeft, setTimeLeft] = useState(null);

  const timerRef = useRef(); // Ref to hold the timeout ID
  const totalQuestions = quizQuestion.length;
  const currentQuestion = quizQuestion[currentQuestionIndex];
  // Note: progress based on answered questions (index) not a fixed '5'
  const answeredQuestions = currentQuestionIndex;
  const progressPercentage = (answeredQuestions / totalQuestions) * 100;

  const onToggle = () => {
    setLA((prv) => (prv === LANG.EN ? LANG.TA : LANG.EN));
  };

  // ----------------------------------------------------
  // LOGIC FOR TIMER AND NEXT QUESTION
  // ----------------------------------------------------

  const goToNextQuestion = useCallback(
    (choosedId) => {
      // 1. Clear any running timer
      clearTimeout(timerRef.current);

      // 2. Build payload for current question
      const newEntry = {
        question_id: currentQuestion.id,
        choice_id: choosedId, // null if timed out
      };

      // 3. Update global payload state
      setQuizPayload((prevPayload) => [...prevPayload, newEntry]);

      // 4. Move to the next question or submit the quiz
      if (currentQuestionIndex < totalQuestions - 1) {
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
        setSelectedChoiceId(null); // Reset selection for the new question
      } else {
        // Last question - Final Submit Logic (Optional: Pass the final payload)
        // Call your API here with the final quizPayload
        let payload = [...quizPayload, newEntry];
        handleQuizSubmit(payload);
      }
    },
    [currentQuestionIndex, currentQuestion, totalQuestions, quizPayload]
  );

  // Handle user's submission (e.g., clicking Next/Submit button)
  const onSubmit = () => {
    // Pass the currently selected ID (can be null if user submits without selecting)
    goToNextQuestion(selectedChoiceId);
  };

  // Timer Effect
  useEffect(() => {
    if (!currentQuestion) return;

    const timeLimit = currentQuestion.timeLimit;
    setTimeLeft(timeLimit);

    // Countdown Interval
    const countdownInterval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(countdownInterval);
          // TIME IS OVER: Move to next question, saving selectedChoiceId as null
          goToNextQuestion(null);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => {
      // Cleanup: Clear the interval when component unmounts or currentQuestionIndex changes
      clearInterval(countdownInterval);
    };
  }, [currentQuestionIndex, currentQuestion, goToNextQuestion]);

  // Display timer format (e.g., 0:15)
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Handle radio button selection
  const handleChoiceChange = (event) => {
    setSelectedChoiceId(parseInt(event.target.value));
  };

  if (!currentQuestion)
    return (
      <div className="p-10 text-center">Loading quiz or quiz is empty...</div>
    );

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-8 bg-gray-50 min-h-screen">
      {/* GLOBAL HEADER SECTION */}
      <header className="mb-8 p-4 bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
            {title}
          </h1>
        </div>

        {/* Progress Bar & Counter */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-sm font-semibold text-gray-600 mb-1 flex justify-between">
            <span>Progress</span>
            <span className="text-blue-600">
              {answeredQuestions}/{totalQuestions}
            </span>
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-blue-600 h-2 transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
              aria-valuenow={answeredQuestions}
              aria-valuemin={0}
              aria-valuemax={totalQuestions}
            ></div>
          </div>
        </div>
      </header>

      {/* QUIZ BODY: The main Question Card */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 md:p-8 mb-8">
        {/* Question Header & Timer */}
        <div className="flex justify-between items-start border-b border-gray-100 pb-4 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 pr-4">
            <span className="text-blue-600 mr-2">
              Q{currentQuestionIndex + 1}:
            </span>
            {currentQuestion?.question}
          </h2>

          {/* Timer component, now specific to this question */}
          <div
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg border shadow-sm flex-shrink-0 transition-colors ${
              timeLeft <= 5
                ? "text-red-600 bg-red-50 border-red-200"
                : "text-orange-600 bg-orange-50 border-orange-200"
            }`}
          >
            <Timer className="w-5 h-5" />
            <span className="font-mono text-lg font-bold">
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        {/* Options */}
        <div className="space-y-4">
          {currentQuestion.choices.map((choice, idx) => (
            <label
              key={choice.id}
              className={`flex items-center p-4 border rounded-xl hover:bg-blue-50 cursor-pointer transition-colors ${
                selectedChoiceId === choice.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200"
              }`}
            >
              <input
                type="radio"
                name={`question-${currentQuestion.id}`}
                value={choice.id}
                checked={selectedChoiceId === choice.id}
                onChange={handleChoiceChange}
                className="w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300 transition duration-150 ease-in-out"
              />
              <span className="ml-4 text-base font-medium text-gray-900">
                {choice.choise}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* FOOTER/ACTION BAR */}
      <div className="flex justify-between items-center p-4 bg-white rounded-xl shadow-sm border border-gray-100">
        <button
          onClick={onSubmit}
          className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/50 transition-all"
        >
          {currentQuestionIndex === totalQuestions - 1
            ? "Submit Quiz"
            : "Next Question"}{" "}
          &rarr;
        </button>
      </div>
    </div>
  );
};

export default QuizForm;
