import { BASE_URL, SERVICE } from "@/constants/services";
import toast from 'react-hot-toast';
import Lib from "@/utils/Lib";
import { useEffect, useState, useCallback } from "react";
import useQueryParams from "./useQueryParams";


interface OptionsProps {
    query?: { [key: string]: any };
    avoidFetch?: boolean
    key?: number | undefined | string;
    unique?: string;// id
    prevData?: Boolean
    exports?: Boolean
    downloadFilename?: string
}


const useGetCall = (services: string, initialOptions: OptionsProps = {}) => {

    const { navigate } = useQueryParams()
    const [loading, setLoading] = useState<boolean>(true);
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);


    const urlQueryGenerate = (apiUrl: any, query: any) => {
        if (Object.keys(query).length) {
            if (query.filter) {
                apiUrl.searchParams.append(
                    "search_param",
                    JSON.stringify(query.filter)
                );
            }
            if (query.search) {
                apiUrl.searchParams.append("search", query.search || "");
            }
            if (query.pageSize) {
                apiUrl.searchParams.append("page_size", query.pageSize);
            }
            if (query.pageNo) {
                apiUrl.searchParams.append("page_number", query.pageNo);
            }

            if (query.sortBy) {
                apiUrl.searchParams.append("sortBy", query.sortBy);
            }
            if (query.sortDir) {
                apiUrl.searchParams.append("sortDir", query.sortDir);
            }
            if (query.exports) {
                apiUrl.searchParams.append("exports", query.exports);
            }
        }
        return apiUrl;
    };


    const fetchApi = async (Options: OptionsProps) => {

        setLoading(true)
        if (!Options?.avoidFetch) {
            try {
                const authToken = Lib.getCookies("session-token");


                let apiUrl = new URL(
                    `${BASE_URL}${SERVICE[services] ?? services}${Options?.key ? `/${Options.key}` : ""}`
                );

                apiUrl = urlQueryGenerate(
                    apiUrl,
                    Object.keys(Options?.query ?? {}).length ? Options?.query : {}
                );


                const response = await fetch(apiUrl, {
                    headers: {
                        Authorization: `Bearer ${authToken ?? ""}`,
                    },
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        Lib.removeCookies("session-token");
                        // router.replace("/login");
                        navigate.replace("/login")
                        // throw new Error("Session Expired please logisn"); // Temporarily
                    } else if (response.status === 500) {
                        throw new Error("Server Error, Please Try Later");
                    } else if (response.status === 400) {

                        const error: any = await response.json()
                        throw new Error(error?.message ?? "Record Not Found");
                    } else {
                        throw new Error("Network Error");
                    }
                }

                if (Options?.exports) {
                    const blob: any = await response.blob();
                    const createdURLObj = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.style.display = "none";
                    a.href = createdURLObj;
                    a.download = Options?.downloadFilename ?? 'download.xlsx'
                    document.body.appendChild(a);
                    a.click();
                    return window.URL.revokeObjectURL(createdURLObj);
                }

                const jsonData = await response.json();
                if (Options?.prevData && Options?.query?.pageNo && Options.query.pageNo > 1) {
                    setData((prevData: any) => {
                        const existingIds = new Set(
                            prevData.data.map((obj: any) => obj[Options?.unique ?? 'id'])
                        );

                        const newData = jsonData.data.filter(
                            (obj: any) => !existingIds.has(obj[Options?.unique ?? 'id'])
                        );

                        return { ...prevData, data: [...prevData.data, ...newData] };
                    });
                } else {
                    setData(jsonData);
                }

                setLoading(false);
                return jsonData;
            } catch (error: any) {
                toast.error(error.message)
                setError(error.message);
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    }


    const setQuery = (Query: any = {}) => {
        fetchApi({ query: Query });
    }


    useEffect(() => {
        fetchApi(initialOptions);
    }, [])




    return {
        loading,
        data,
        error,
        setQuery,
        fetchApi
    };


};

export default useGetCall;