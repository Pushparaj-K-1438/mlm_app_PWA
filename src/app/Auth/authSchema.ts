import * as Yup from "yup";


export const LOGIN_SCHEMA = Yup.object().shape({
    username: Yup.string().required("Required Email Address*"),
    password: Yup.string().required("Required Password*"),
});
