import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
export const STORAGE_BASE_URL = import.meta.env.VITE_STORAGE ?? "";

const Lib = {

    setCookies({ name = "cookies", value = "", exp = 1 }: { name: string, value: string, exp: number | Date | undefined }) {
        Cookies.set(name, value, {
            expires: exp,
        });
    },
    removeCookies(keyName: string = '') {
        Cookies.remove(keyName);
    },
    getCookies(keyName: string) {
        return Cookies.get(keyName);
    },
    DecodeJwt(token: string | undefined | null = "") {
        try {
            if (token) {
                return jwtDecode(token);
            } else {
                return null
            }

        } catch (e) {
            return null;
        }
    },
    cn(...inputs: ClassValue[]) {
        return twMerge(clsx(inputs));
    },
    expiredSec(millionSec: number) {
        const expiresInSeconds = millionSec - Date.now() / 1000;
        return expiresInSeconds / (24 * 60 * 60);
    },
    payloadFormat(payload: any, emptyApply: string | null = null) {
        // Deep copy the payload to avoid modifying the original
        let formatPayload: any = JSON.parse(JSON.stringify(payload));

        // Recursive function to process objects and arrays
        function processItem(item: any): any {
            // Handle arrays
            if (Array.isArray(item)) {
                return item.map((element: any) => processItem(element));
            }
            // Handle objects with a 'value' property
            if (typeof item === 'object' && item !== null && 'value' in item) {
                return item.value;
            }
            // Handle other objects
            if (typeof item === 'object' && item !== null) {
                const result: any = {};
                for (const key of Object.keys(item)) {
                    result[key] = processItem(item[key]);
                }
                return result;
            }
            // Handle strings (empty string replacement)
            if (typeof item === 'string' && !item.trim().length) {
                return emptyApply;
            }
            // Return unchanged for other types
            return item;
        }

        // Process the entire payload
        const result = processItem(formatPayload);


        return result;
    },

    breakTextWhileSpace(name: string) {
        const nameParts = name.split(' ');
        if (nameParts.length > 1) {
            return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
        }
        return name[0].toUpperCase();
    },
    CloudPath(fileName: string) {

        return `${STORAGE_BASE_URL}/storage/uploads/final/${fileName}`
    },
    getFileName(uniqueFilename = '') {
        let filename = uniqueFilename.split("_");
        return filename[filename.length - 1] ?? ''
    },
    selectOptions(value, OPTIONS: any = []) {
        return OPTIONS.find((item: any) => item.value == value)
    },
    // Converts backend question array (alternating EN/TA) → formatted question list
    transformQuestionsFromResponse(questions = [], lang = 2) {
        let formattedQuestions = [];

        formattedQuestions = questions.filter(quizItem => quizItem.lang_type == lang).map(item => ({
            id: item.id,
            question: item?.question,
            timeLimit: item?.time_limit ?? 30,
            promotor: item?.promotor,
            promotor1: item?.promotor1,
            promotor2: item?.promotor2,
            promotor3: item?.promotor3,
            promotor4: item?.promotor4,
            choices:
                item?.choices?.map((choice: any, index: any) => ({
                    id: choice?.id ?? "",
                    choise: choice?.choice_value ?? "",
                    isCorrect: choice?.is_correct ?? false,
                })) ?? [],

        }))

        // for (let i = 0; i < questions.length; i += 2) {
        //     const enQuestion = questions[i];
        //     const taQuestion = questions[i + 1];

        //     formattedQuestions.push({
        //         id: enQuestion?.id,
        //         question: enQuestion?.question ?? "",
        //         questionTa: taQuestion?.question ?? "",
        //         timeLimit: enQuestion?.time_limit ?? 0,
        //         promotor: enQuestion?.promotor,
        //         promotor1: enQuestion?.promotor1,
        //         promotor2: enQuestion?.promotor2,
        //         promotor3: enQuestion?.promotor3,
        //         promotor4: enQuestion?.promotor4,
        //         choices:
        //             enQuestion?.choices?.map((choice: any, index: any) => ({
        //                 id: choice?.id ?? "",
        //                 textEn: choice?.choice_value ?? "",
        //                 textTa: taQuestion?.choices?.[index]?.choice_value ?? "",
        //                 isCorrect: choice?.is_correct ?? false,
        //             })) ?? [],
        //     });
        // }

        return formattedQuestions;
    },

    checkQuizCorrect(questions = [], submitQuestion = [], lang = 2) {


        const Q = this.transformQuestionsFromResponse(questions ?? [], lang)
        let correctCount = 0;

        submitQuestion.forEach(submission => {
            const question = Q.find(q => q.id === submission.question_id);
            if (question) {
                const choice = question.choices.find(c => c.id === submission.choice_id);
                if (choice && choice.isCorrect === 1) {
                    correctCount++;
                }
            }
        });

        return `You scored ${correctCount} out of ${submitQuestion.length}`;



    },

    // Converts formatted question list → payload for backend (both EN + TA)
    generateQuestionPayload(questions = []) {
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
    },

    getBaseURL() {
        const baseUrl = `${window.location.protocol}//${window.location.host}`;
        return baseUrl
    },

    maskLast4Digits(num: string | number) {
        const str = String(num);
        return `**${str.slice(-4)}`;
    },
    
    /**
     * Formats a number to 2 decimal places
     * @param {number|string} amount - The amount to format
     * @returns {string} Formatted amount with 2 decimal places
     */
    formatAmount(amount: number | string): string {
        const num = typeof amount === 'string' ? parseFloat(amount) : amount;
        return isNaN(num) ? '0.00' : num.toFixed(2);
    }

}

export default Lib