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


export const SELECT_OVERLAY: any = {

    USERS: {
        formType: "FETCH_SELECT",
        title: "Select Users",
        placeHolder: "Search",
        isMulti: false,
        setQueryName: "user_id",
        api: SERVICE.USERS,
        label: "email",
        value: "id",
        filter: {
            attributes: ['email', 'id']
        },
    },

    INVITE_CODE: {
        formType: "FETCH_SELECT",
        title: "Invite Code",
        placeHolder: "Search Invite code",
        isMulti: false,
        setQueryName: "invitation",
        api: SERVICE.INVITE_CODE,
        label: "invitation_code",
        value: "id",
        filter: {
            attributes: ['id', 'invitation_code']
        },
    },

    CATEGORIES_TYPE: {
        formType: "SELECT",
        title: "Category Type",
        isMulti: false,
        setQueryName: "category_type",
        customOptions: DATA_SELECT.LINK_TYPE,
    },
    LOGIN_BY: {
        formType: "SELECT",
        title: "Login By",
        isMulti: false,
        setQueryName: "login_by",
        customOptions: [
            {
                label: "Facebook",
                value: "Facebook",
            },
            {
                label: "Email",
                value: "Email",
            },
            {
                label: "Linkedin",
                value: "Linkedin",
            },
            {
                label: "Gmail",
                value: "Gmail"
            }
        ],
    },

    CATEGORY: {
        formType: "FETCH_SELECT",
        title: "Select Category",
        placeHolder: "Search ...",
        isMulti: false,
        setQueryName: "category_id",
        api: SERVICE.CATEGORIES,
        label: "category_name",
        value: "id",
        filter: {
            category_type: "category"
        },
    },
    CORCEN: {
        formType: "FETCH_SELECT",
        title: "Select Concern",
        placeHolder: "Search ...",
        isMulti: false,
        setQueryName: "concern_id",
        api: SERVICE.CATEGORIES,
        label: "category_name",
        value: "id",
        filter: {
            category_type: "concern"
        },
    },
    INGREDIENT: {
        formType: "FETCH_SELECT",
        title: "Select Ingredient",
        placeHolder: "Search ...",
        isMulti: true,
        setQueryName: "ingredient_id",
        api: SERVICE.CATEGORIES,
        label: "category_name",
        value: "id",
        filter: {
            category_type: "ingredient"
        },
    },
    IS_BEST_SALE: {
        formType: "SELECT",
        title: "BEST SALE",
        isMulti: false,
        setQueryName: "is_best_sell",
        customOptions: [{
            label: 'is_best_sell',
            value: 1
        },
        {
            label: 'no_best_sell',
            value: 0
        }]
    },
    // INGREDIENCT: {
    //     formType: "FETCH_SELECT",
    //     title: "Select Ingredient",
    //     placeHolder: "Search ...",
    //     isMulti: true,
    //     setQueryName: "category_id",
    //     api: SERVICE.CATEGORIES,
    //     label: "category_name",
    //     value: "id",
    //     filter: {
    //         category_type: "ingredient"
    //     },
    // },

    INCOME_CATEGORY: {
        formType: "FETCH_SELECT",
        title: "Select Category",
        placeHolder: "Search ...",
        isMulti: false,
        setQueryName: "category_id",
        api: SERVICE.CATEGORIES,
        label: "category_name",
        value: "id",
        filter: {
            link_type: "Income"
        },
    },
    EXPENSE_CATEGORY: {
        formType: "FETCH_SELECT",
        title: "Select Category",
        placeHolder: "Search ...",
        isMulti: false,
        setQueryName: "category_id",
        api: SERVICE.CATEGORIES,
        label: "category_name",
        value: "id",
        filter: {
            link_type: "Expense"
        },
    },
    LIABLITY_CATEGORY: {
        formType: "FETCH_SELECT",
        title: "Select Category",
        placeHolder: "Search ...",
        isMulti: false,
        setQueryName: "category_id",
        api: SERVICE.CATEGORIES,
        label: "category_name",
        value: "id",
        filter: {
            link_type: "Liability"
        },
    },
    ASSET_CATEGORY: {
        formType: "FETCH_SELECT",
        title: "Select Category",
        placeHolder: "Search ...",
        isMulti: false,
        setQueryName: "category_id",
        api: SERVICE.CATEGORIES,
        label: "category_name",
        value: "id",
        filter: {
            link_type: "Asset"
        },
    },
};

export const CURRENCY: any = {
    USD: {
        entity: "&dollar;",
        code: "USD",
        name: "US Dollar",
        symbol: "$",
        flag: "/assets/images/flags/US.svg"
    },
    CAD: {
        entity: "&dollar;",
        code: "CAD",
        name: "Canadian Dollar",
        symbol: "$",
        flag: "/assets/images/flags/US.svg"
    },
    BHD: {
        entity: "&#46;&#1603;&#46;&#1576;",
        code: "BHD",
        name: "Bahraini Dinar",
        symbol: "ك.ب",
        flag: "/assets/images/flags/US.svg"//TODO replace correct Flag
    },
    INR: {
        entity: "&#8377;",
        code: "INR",
        name: "Indian Rupee",
        symbol: "₹",
        flag: "/assets/images/flags/IN.svg"
    },
    GBP: {
        entity: "&pound;",
        code: "GBP",
        name: "British Pound Sterling",
        symbol: "£",
        flag: "/assets/images/flags/GB-ENG.svg"
    },
    OMR: {
        entity: "&#1585;&#46;&#1593;&#46;",
        code: "OMR",
        name: "Omani Rial",
        symbol: " ر.ع.",
        flag: "/assets/images/flags/US.svg"//TODO replace correct Flag
    },
    // PKR: {  // not got historical currency
    //   entity: "&#8360;",
    //   code: "PKR",
    //   name: "Pakistani Rupee",
    //   symbol: "₨",
    // },
    QAR: {
        entity: "&#81;&#82;",
        code: "QAR",
        name: "Qatari Rial",
        symbol: "QR",
        flag: "/assets/images/flags/US.svg"//TODO replace correct Flag
    },
    SAR: {
        entity: "&#65020;",
        code: "SAR",
        name: "Saudi Riyal",
        symbol: "﷼",
        flag: "/assets/images/flags/US.svg"//TODO replace correct Flag
    },
    SGD: {
        entity: "&dollar;",
        code: "SGD",
        name: "Singapore Dollar",
        symbol: "$",
        flag: "/assets/images/flags/US.svg"//TODO replace correct Flag
    },
    AED: {
        entity: "&#1583;&#46;&#1573;",
        code: "AED",
        name: "UAE Dirham",
        symbol: "د.إ",
        flag: "/assets/images/flags/US.svg"//TODO replace correct Flag
    },
    EUR: {
        entity: "&euro;",
        code: "EUR",
        name: "Eur",
        symbol: "€",
        flag: "/assets/images/flags/US.svg"//TODO replace correct Flag
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
    BLOG_MODAL: 'Blog',
    COMBO_MODAL: 'ComboProduct',
    CATEGORY_MODAL: 'Category',
    TESTIMONIALS_MODAL: 'Testimonials',
    BANNER_MODAL: 'Banner',
    INVITE_MODAL: 'Invite',
    ENQURIES: 'Enquire',
    COUPONS: 'Coupons',
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
    VIDEO_ORDER: [{ value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "4", label: "4" },],
    LANG: [
        { value: "Hindi", label: "Hindi" },
        { value: "Kannada", label: "Kannada" },
        { value: "Malayalam", label: "Malayalam" },
        { value: "Tamil", label: "Tamil" },
        { value: "Telugu", label: "Telugu" },
        { value: "English", label: "English" }
    ],
    WALLET_TYPE: [
        { label: 'Cash Wallet ', value: '1' },
        { label: 'Scratch Wallet', value: '2' },
        { label: 'Grow Wallet', value: '3' },
    ],
    PIN_STATUS: [{ value: "0", label: "Pending" },
    { value: "1", label: "Approved" },
    { value: "2", label: "Activated" },
    { value: "3", label: "Rejected" },],


}

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