export const BASE_URL = import.meta.env.VITE_BASE_URL ?? "";
export const SERVICE: any = {
    //Auth
    LOGIN: "auth/login",
    REGISTER: "auth/register",

    // Auth Routes
    DAILYVIDEOS: "daily-videos",
    YOUTUBECHANNELS: "youtube-channels",
    SCRATCHSETUP: "scratch-setup",
    TRAININGVIDEOS: "training-videos",
    TRAININGVIDEOQUIZES: "training-video-quizzes",
    PROMOTIONVIDEOS: "promotion-videos",
    PROMOTIONVIDEOQUIZES: "promotion-video-quizzes",
    GET_PROFILE: "auth-user",
    GET_BANK_INFO: 'user-bank-detail',
    REFERRALS: 'referrals',
    GET_ALL_REFERRALS: 'all-referrals',
    PROFILE_UPDATE: "update-personal-details",
    GET_BANK_DETAILS: "user-bank-detail",
    BANK_DETAILS_UPDATE: "user-bank-detail/upsert",
    GET_ADMIN_BANK_DETAILS: "admin-bank-details",
    ADMIN_BANK_DETAILS_UPDATE: "admin-bank-details/upsert",
    GET_ADDITIONAL_SCRAT: "additional-scratch-referrals",
    ADDITIONAL_SCRAT_UPDATE: "additional-scratch-referrals/upsert",
    CHANGE_PASSWORD: "changepassword",
    USER_PROMOTERS: "user-promoters",
    ADMIN_PIN_REQUESTS: "user-promoters",
    RIASE_TERM: "term-raised",
    GENERATE_PIN: "generate-pin",
    REJECT_REQUEST: "pin-rejected",
    GET_PIN_REQUESTS: "user-promoters/list",
    ACTIVATE_PIN: "activate-pin",
    ACCEPT_TERMS: "term-accepted",
    GET_SCRATCH: 'scratch-setup',
    WITHDRAW_UPDATE_STATUS: 'withdraw-status-update',
    SCRATCH_CARDS: "get-scratch-cards",
    SCRATCHED_STATUS_UPDATE: "scratched-status-update",
    USER_DASHBOARD: "user-dashboard",
    ADMIN_DASHBOARD: "admin-dashboard",


    //Export 
    EXPORT_EXCEL: 'withdraws/export/excel',

    //User Service endpoint
    DAILY_VIDEO_STATUS: 'daily-videos-status',
    DAILY_VIDEO_TODAY: 'daily-videos-today',
    DAILY_VIDEO_STATUS_UPDATE: 'daily-videos-watched',
    GET_PROMOTION_VIDEO: 'user-promoter-video-get',
    PROMOTION_VIDEO_QUIZ_UPDATE: 'user-promoter-quiz-result-get',
    PROMOTION_VIDEO_QUIZ_CONFIRM: 'user-promoter-quiz-result-confirmation',


    USER_TRAINING_CURRENCT: 'user-training-current',
    TRAINING_STATUS_UPDATE: 'user-day-training-mark-as-completed',
    EARNINGS_HISTORY: 'earning-histories',
    WITHDRAW_HISTRY: 'withdraw-histories',
    WITHDRAW_REQUEST: 'withdraws'


}