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
        let formatPayload: any = JSON.parse(JSON.stringify(payload));

        function processItem(item: any): any {
            if (Array.isArray(item)) {
                return item.map((element: any) => processItem(element));
            }
            if (typeof item === 'object' && item !== null && 'value' in item) {
                return item.value;
            }
            if (typeof item === 'object' && item !== null) {
                const result: any = {};
                for (const key of Object.keys(item)) {
                    result[key] = processItem(item[key]);
                }
                return result;
            }
            if (typeof item === 'string' && !item.trim().length) {
                return emptyApply;
            }
            return item;
        }

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
    selectOptions(value: any, OPTIONS: any = []) {
        return OPTIONS.find((item: any) => item.value == value)
    },
    transformQuestionsFromResponse(questions = [], lang = 2) {
        let formattedQuestions = [];

        formattedQuestions = questions.filter((quizItem: any) => quizItem.lang_type == lang).map((item: any) => ({
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

        return formattedQuestions;
    },

    checkQuizCorrect(questions = [], submitQuestion = [], lang = 2) {
        const Q = this.transformQuestionsFromResponse(questions ?? [], lang)
        let correctCount = 0;

        submitQuestion.forEach((submission: any) => {
            const question = Q.find((q: any) => q.id === submission.question_id);
            if (question) {
                const choice = question.choices.find((c: any) => c.id === submission.choice_id);
                if (choice && choice.isCorrect === 1) {
                    correctCount++;
                }
            }
        });

        return `You scored ${correctCount} out of ${submitQuestion.length}`;
    },

    getBaseURL() {
        const baseUrl = `${window.location.protocol}//${window.location.host}`;
        return baseUrl
    },

    maskLast4Digits(num: string | number) {
        const str = String(num);
        return `**${str.slice(-4)}`;
    },

    formatAmount(amount: number | string): string {
        const num = typeof amount === 'string' ? parseFloat(amount) : amount;
        return isNaN(num) ? '0.00' : num.toFixed(2);
    }

}

export default Lib
