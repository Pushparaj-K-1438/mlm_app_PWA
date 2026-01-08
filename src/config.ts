const isProduction = import.meta.env.MODE === "production";
const config = {
    basename: "",
    defaultPath: "/",
    apiBase: isProduction
        ? `https://be.starup.in`
        : `http://127.0.0.1:8000`,
    apiBaseURL: isProduction
        ? `https://be.starup.in/api`
        : `http://127.0.0.1:8000/api`,
};
export default config;
