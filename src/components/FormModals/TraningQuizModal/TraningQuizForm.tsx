import * as Yup from "yup";
import { useFormik, FormikErrors } from "formik";
import { useMemo } from "react";
import Btn from "@/components/ui/Btn";
import { Clock, IndianRupee, Plus, Trash2 } from "lucide-react";

// --- Yup Validation Schema ---
const choiceSchema = Yup.object().shape({
  textEn: Yup.string().required("English choice required"),
  textTa: Yup.string().required("Tamil choice required"),
});

const questionSchema = Yup.object().shape({
  questionEn: Yup.string().required("English question is required"),
  questionTa: Yup.string().required("Tamil question is required"),
  timeLimit: Yup.number().min(10).max(300).required("Time limit is required"),
  choices: Yup.array()
    .of(choiceSchema)
    .min(2, "At least 2 choices required")
    .test("hasCorrect", "one correct choice is required", (choices) =>
      choices ? choices.some((c: any) => c.isCorrect == true) : false
    ),
  promotor: Yup.number()
    .min(1, "promotor must be greater than or equal to 1")
    .required("Earning for promotor is required"),
  promotor1: Yup.number()
    .min(1, "promotor 1 must be greater than or equal to 1")
    .required("Earning for promotor1 is required"),
  promotor2: Yup.number()
    .min(1, "promotor 2 must be greater than or equal to 1")
    .required("Earning for promotor2 is required"),
  promotor3: Yup.number()
    .min(1, "promotor 3 must be greater than or equal to 1")
    .required("Earning for promotor3 is required"),
  promotor4: Yup.number()
    .min(1, "promotor 4 must be greater than or equal to 1")
    .required("Earning for promotor4 is required"),
});

const quizSchema = Yup.object().shape({
  training_video_id: Yup.string().required(),
  is_active: Yup.boolean().required(),
  questions: Yup.array().of(questionSchema),
});

const Question = [
  {
    questionEn: "",
    questionTa: "",
    timeLimit: 30,
    promotor: 1,
    promotor1: 2,
    promotor2: 3,
    promotor3: 4,
    promotor4: 5,
    choices: [
      { textEn: "", textTa: "", isCorrect: false },
      { textEn: "", textTa: "", isCorrect: false },
    ],
  },
];

// Converts backend question array (alternating EN/TA) → formatted question list
const transformQuestionsFromResponse = (questions = []) => {
  const formattedQuestions = [];

  for (let i = 0; i < questions.length; i += 2) {
    const enQuestion = questions[i];
    const taQuestion = questions[i + 1];

    formattedQuestions.push({
      questionEn: enQuestion?.question ?? "",
      questionTa: taQuestion?.question ?? "",
      timeLimit: enQuestion?.time_limit ?? 0,
      promotor: enQuestion?.promotor,
      promotor1: enQuestion?.promotor1,
      promotor2: enQuestion?.promotor2,
      promotor3: enQuestion?.promotor3,
      promotor4: enQuestion?.promotor4,
      choices:
        enQuestion?.choices?.map((choice: any, index: any) => ({
          textEn: choice?.choice_value ?? "",
          textTa: taQuestion?.choices?.[index]?.choice_value ?? "",
          isCorrect: choice?.is_correct ?? false,
        })) ?? [],
    });
  }

  return formattedQuestions;
};

// Converts formatted question list → payload for backend (both EN + TA)
const generateQuestionPayload = (questions = []) => {
  const payload = [];

  questions.forEach((item) => {
    const baseData = {
      time_limit: item?.timeLimit ?? 0,
      promotor: item?.promotor,
      promotor1: item?.promotor1,
      promotor2: item?.promotor2,
      promotor3: item?.promotor3,
      promotor4: item?.promotor4,
    };

    // English entry
    payload.push({
      ...baseData,
      lang_type: 1,
      question: item?.questionEn ?? "",
      choices:
        item?.choices?.map((c) => ({
          lang_type: 1,
          choice_value: c?.textEn ?? "",
          is_correct: c?.isCorrect ?? false,
        })) ?? [],
    });

    // Tamil entry
    payload.push({
      ...baseData,
      lang_type: 2,
      question: item?.questionTa ?? "",
      choices:
        item?.choices?.map((c) => ({
          lang_type: 2,
          choice_value: c?.textTa ?? "",
          is_correct: c?.isCorrect ?? false,
        })) ?? [],
    });
  });

  return payload;
};

const TraningQuizForm = ({
  data = {},
  onAction = (values: any) => {},
  onCloseModal = () => {},
  loading = false,
  RequestError = {},
}: any) => {
  const {
    values,
    errors,
    handleSubmit,
    handleChange,
    setFieldValue,
    setErrors,
  } = useFormik({
    initialValues: {
      training_video_id: data?.training_video_id,
      is_active: true,
      questions: data?.questions
        ? transformQuestionsFromResponse(data?.questions)
        : Question,
    },
    onSubmit: async (values: any) => {
      let payload = {
        ...values,
        questions: generateQuestionPayload(values.questions),
      };
      onAction(payload);
    },
    validateOnChange: false,
    validateOnBlur: true,
    validationSchema: quizSchema,
  });

  useMemo(() => {
    if (RequestError && Object.keys(RequestError).length) {
      setErrors(RequestError);
    }
  }, [RequestError, setErrors]);

  return (
    <form onSubmit={handleSubmit}>
      {values.questions.map((question, qIndex) => (
        <div
          key={qIndex}
          className="border border-gray-200 rounded-lg p-6 mb-6"
        >
          {/* Header with time limit */}
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-md font-medium text-gray-900">
              Question {qIndex + 1}
            </h4>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <input
                type="number"
                name={`questions[${qIndex}].timeLimit`}
                value={question.timeLimit}
                onChange={handleChange}
                min="10"
                max="300"
                className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
              />
              <span className="text-sm text-gray-500">sec</span>
            </div>
            {values.questions?.length > 1 && (
              <button
                type="button"
                onClick={() => {
                  const newQuestion = [...values.questions];
                  newQuestion.splice(qIndex, 1);
                  setFieldValue(`questions`, newQuestion);
                  let errorsCopy: FormikErrors<any>[] = [];
                  if (Array.isArray(errors?.questions)) {
                    errorsCopy = errors.questions as FormikErrors<any>[];
                    errorsCopy = [...errorsCopy];
                    errorsCopy.splice(qIndex, 1);
                    setErrors({ ...errors, questions: errorsCopy });
                  } else {
                    setErrors({ ...errors, questions: [] });
                  }
                }}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* English / Tamil Questions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Question (English) *
              </label>
              <textarea
                name={`questions[${qIndex}].questionEn`}
                value={question.questionEn}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Enter question in English"
              />
              {errors.questions?.[qIndex]?.questionEn && (
                <p className="text-red-500 text-sm">
                  {(errors.questions as any)[qIndex]?.questionEn}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Question (Tamil) *
              </label>
              <textarea
                name={`questions[${qIndex}].questionTa`}
                value={question.questionTa}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="தமிழில் கேள்வியை உள்ளிடவும்"
              />
              {errors.questions?.[qIndex]?.questionTa && (
                <p className="text-red-500 text-sm">
                  {(errors.questions as any)[qIndex]?.questionTa}
                </p>
              )}
            </div>
          </div>

          {/* Choices */}
          <div className="space-y-2 mt-2">
            {question.choices.map((choice, cIndex) => (
              <div
                key={cIndex}
                className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
              >
                {/* Radio button to mark correct */}
                <input
                  type="radio"
                  name={`questions[${qIndex}].correctChoice`}
                  checked={choice.isCorrect}
                  onChange={() => {
                    question.choices.forEach((_: any, i: number) =>
                      setFieldValue(
                        `questions[${qIndex}].choices[${i}].isCorrect`,
                        i === cIndex
                      )
                    );
                  }}
                />
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <input
                      type="text"
                      name={`questions[${qIndex}].choices[${cIndex}].textEn`}
                      value={choice.textEn}
                      onChange={handleChange}
                      className="px-3 py-2 border rounded-lg w-full"
                      placeholder={`Choice ${cIndex + 1} (English)`}
                    />
                    {typeof errors?.questions?.[qIndex]?.choices ===
                      "object" && (
                      <p className="text-red-500 text-sm">
                        {
                          (errors.questions as any)[qIndex]?.choices[cIndex]
                            ?.textEn
                        }
                      </p>
                    )}
                  </div>
                  <div>
                    <input
                      type="text"
                      name={`questions[${qIndex}].choices[${cIndex}].textTa`}
                      value={choice.textTa}
                      onChange={handleChange}
                      className="px-3 py-2 border rounded-lg w-full"
                      placeholder={`விருப்பம் ${cIndex + 1} (தமிழ்)`}
                    />
                    {typeof errors?.questions?.[qIndex]?.choices ===
                      "object" && (
                      <p className="text-red-500 text-sm">
                        {
                          (errors.questions as any)[qIndex]?.choices[cIndex]
                            ?.textTa
                        }
                      </p>
                    )}
                  </div>
                </div>
                {question.choices.length > 2 && (
                  <button
                    type="button"
                    onClick={() => {
                      const newChoices = [...question.choices];
                      newChoices.splice(cIndex, 1);
                      setFieldValue(`questions[${qIndex}].choices`, newChoices);
                    }}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            {typeof errors?.questions?.[qIndex]?.choices === "string" && (
              <p className="text-red-500 text-sm">
                {(errors.questions as any)[qIndex]?.choices}
              </p>
            )}
            <button
              type="button"
              onClick={() => {
                const newChoices = [
                  ...question.choices,
                  { textEn: "", textTa: "", isCorrect: false },
                ];
                setFieldValue(`questions[${qIndex}].choices`, newChoices);
              }}
              className="text-blue-500"
            >
              + Add Choice
            </button>
          </div>

          {/* <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
              <IndianRupee className="w-5 h-5 mr-2" />
              Earnings per Level
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                "promotor",
                "promotor1",
                "promotor2",
                "promotor3",
                "promotor4",
              ].map((prom, idx) => (
                <div key={idx}>
                  <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                    promotor {Boolean(idx) && idx}
                  </label>
                  <input
                    type="number"
                    name={`questions[${qIndex}].${prom}`}
                    value={question[prom]}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {errors.questions?.[qIndex]?.[prom] && (
                    <p className="text-red-500 text-sm">
                      {(errors.questions as any)[qIndex]?.[prom]}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div> */}
        </div>
      ))}

      <button
        type="button"
        onClick={() => {
          const newQuestion = [...values.questions, ...Question];
          setFieldValue(`questions`, newQuestion);
        }}
        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors"
      >
        <Plus className="w-5 h-5 mx-auto mb-1" />
        Add Another Question
      </button>

      {/* Footer */}
      <div className="flex justify-end space-x-3 pt-4">
        <Btn
          title="Cancel"
          onClick={onCloseModal}
          uiType="secondary"
          type="button"
        />
        <Btn title="Submit" isLoading={loading} type="submit" />
      </div>
    </form>
  );
};

export default TraningQuizForm;
