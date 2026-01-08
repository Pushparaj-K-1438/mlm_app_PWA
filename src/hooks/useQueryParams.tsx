// Copied from main app with refactored imports using @/ alias
import { useCallback } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { SELECT_OVERLAY } from "@/constants/others";

interface QueryParams {
    name?: string;
    value?: string;
    options?: { [key: string]: string };
    deleteParams?: string[];
    clearAll?: boolean;
}

const useQueryParams = (): {
    searchParams: URLSearchParams;
    navigate: any;
    pathname: string;
    updateSearchParam: (params: QueryParams) => void;
    extractFilterOnQuery: (TABLE_FILTER?: any[]) => { [key: string]: any }; // FIXED SYNTAX HERE
    notFound: any;
    defaultFilter: any
} => {
    const location = useLocation();
    const router = useNavigate();

    const [searchParams] = useSearchParams();
    const pathname = location.pathname;

    const navigate = {
        push(path: string) {
            router(path);
        },
        replace(path: string) {
            router(path, { replace: true });
        },
        goBack() {
            router(-1);
        },
        goForward() {
            router(1);
        }
    };

    const updateSearchParam = useCallback(
        ({
            name = "",
            value = "",
            options = {},
            deleteParams = [],
            clearAll = false,
        }: QueryParams) => {
            const params = new URLSearchParams(searchParams.toString());

            if (clearAll) {
                params.delete(name);
            } else {
                if (name && value) {
                    params.set(name, value);
                }

                Object.entries(options).forEach(([key, value]) => {
                    params.set(key, value);
                });

                deleteParams.forEach((param) => {
                    params.delete(param);
                });
            }

            navigate.push(`${pathname}?${params.toString()}`);
        },
        [searchParams, pathname, navigate]
    );

    const extractFilterOnQuery = (TABLE_FILTER: any = []) => {
        let filter: any = {};
        TABLE_FILTER.map((ObjKey: string) => {
            // Safety check to ensure the key exists in constants
            const config = SELECT_OVERLAY[ObjKey];
            if (!config) return;

            if (['FETCH_SELECT', 'SELECT'].includes(config.formType)) {
                if (config.isMulti) {
                    let extractOnURL = searchParams.get(config.setQueryName)
                        ? JSON.parse(searchParams.get(config.setQueryName) ?? '')
                        : [];

                    if (extractOnURL.length) {
                        filter[config.setQueryName] = extractOnURL.map((item: any) => item.value);
                    }
                }
                if (!config.isMulti) {
                    let extractOnURL = searchParams.get(config.setQueryName)
                        ? JSON.parse(searchParams.get(config.setQueryName) ?? '')
                        : {};

                    if (extractOnURL?.value) {
                        filter[config.setQueryName] = extractOnURL?.value;
                    }
                }
            }
        });

        return filter;
    };

    const defaultFilter = {
        filter: {},
        pageNo: 1,
        pageSize: 10,
        sortDir: "",
        sortBy: "",
        search: "",
    };

    return {
        searchParams,
        navigate,
        pathname,
        updateSearchParam,
        extractFilterOnQuery,
        notFound: () => { throw new Error("Page not found"); },
        defaultFilter,
    };
};

export default useQueryParams;