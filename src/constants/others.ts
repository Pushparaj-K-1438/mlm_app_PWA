import { SERVICE } from "./services";
export const DATA_SELECT: any = {
    LINK_TYPE: [
        {
            label: 'category',
            value: 'category'
        },
        {
            label: 'concern',
            value: 'concern'
        },
        {
            label: 'ingredient',
            value: 'ingredient'
        },
    ],
    DISCOUNT_TYPE: [
        {
            label: 'amount',
            value: 'amount'
        },
        {
            label: 'percentage',
            value: 'percentage'
        },
    ]
}

export const SELECT_OVERLAY: any = {};

export const CURRENCY: any = {
    USD: {
        entity: "&dollar;",
        code: "USD",
        name: "US Dollar",
        symbol: "$",
        flag: "/assets/images/flags/US.svg"
    },
    INR: {
        entity: "&#8377;",
        code: "INR",
        name: "Indian Rupee",
        symbol: "₹",
        flag: "/assets/images/flags/IN.svg"
    },
};

export const MODAL_OPEN: any = {
    DAILY_VIDEO_MODAL: 'DAILY_VIDEO_MODAL',
    TRAINING_VIDEO_QUIZ_MODAL: 'TRAINING_VIDEO_QUIZ_MODAL',
    TRAINING_VIDEO_MODAL: 'TRAINING_VIDEO_MODAL',
    PROMOTION_VIDEO_MODAL: 'PROMOTION_VIDEO_MODAL',
    PROMOTION_VIDEO_QUIZ_MODAL: 'PROMOTION_VIDEO_QUIZ_MODAL',
    PIN_REQUEST_MODAL: 'PIN_REQUEST_MODAL',
    ACTIVATE_PIN_MODAL: 'ACTIVATE_PIN_MODAL',
    YOUTUBE_MODAL: 'YOUTUBE_MODAL',
    USER_MODAL: 'USER_MODAL',
    WITHDRAW_REQUEST: 'WITHDRAW_REQUEST',
    REFERAL_MODAL: 'REFERAL_MODAL',
}

export const URL_QUERY: any = {
    QUERY_KEY: {
        VIEW: 'View',
        EDIT: 'Edit',
        MODAL: 'Modal',
        TAB: 'Tab',
        SEARCH: 'Search'
    }
}

export const OPTIONS = {
    DAYS: [
        { label: 'Day 1', value: '1' },
        { label: 'Day 2', value: '2' },
        { label: 'Day 3', value: '3' },
        { label: 'Day 4', value: '4' },
        { label: 'Day 5', value: '5' },
        { label: 'Day 6', value: '6' },
        { label: 'Day 7', value: '7' },
    ],
    SESSION_TYPE: [
        { value: "1", label: "Morning Session" },
        { value: "2", label: "Evening Session" },
    ],
    PROMOTER_LEVEL: [
        { value: "0", label: "Promoter", color: "text-blue-600" },
        { value: "1", label: "Promoter Level 1", color: "text-green-600" },
        { value: "2", label: "Promoter Level 2", color: "text-purple-600" },
        { value: "3", label: "Promoter Level 3", color: "text-yellow-600" },
        { value: "4", label: "Promoter Level 4", color: "text-pink-600" },
    ],
    GIFT_DELIVERY_LEVEL: [
        { value: "1", label: "Direct" },
        { value: "2", label: "Courier" },
    ],
    VIDEO_ORDER: [
        { value: "1", label: "1" },
        { value: "2", label: "2" },
        { value: "3", label: "3" },
        { value: "4", label: "4" },
    ],
    LANG: [
        { value: "Hindi", label: "Hindi" },
        { value: "Kannada", label: "Kannada" },
        { value: "Malayalam", label: "Malayalam" },
        { value: "Tamil", label: "Tamil" },
        { value: "Telugu", label: "Telugu" }, { value: "English", label: "English" }
    ],
    WALLET_TYPE: [
        { label: 'Cash Wallet ', value: '1' },
        { label: 'Scratch Wallet', value: '2' },
        { label: 'Grow Wallet', value: '3' },
    ],
    PIN_STATUS: [
        { value: "0", label: "Pending" },
        { value: "1", label: "Approved" },
        { value: "2", label: "Activated" },
        { value: "3", label: "Rejected" },
    ],
}

// Customer role is 2
export const ROLE: any = {
    ADMIN: 0,
    SUPER_ADMIN: 1,
    USER: 2
}

export const LANG: any = {
    EN: 1,
    TN: 2
}

export const WIDTHDROW_STATUS = {
    0: 'pending',
    1: 'processing',
    2: 'completed',
    3: 'rejected'
}

export const PROMOTER_LEVEL = {
    0: 'promotor',
    1: 'promotor1',
    2: 'promotor2',
    3: 'promotor3',
    4: 'promotor4'
}
