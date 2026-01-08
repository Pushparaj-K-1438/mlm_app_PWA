import { useState, useCallback } from "react";
import toast from 'react-hot-toast';
import { BASE_URL, SERVICE } from "@/constants/services";
import useQueryParams from "./useQueryParams";
import Lib from "@/utils/Lib";
import Swal from 'sweetalert2';

interface ActionCallResponse {
    loading: boolean;
    data: any;
    error: any;
    Post: (payload: any, message?: string | undefined) => Promise<any>;
    Put: (
        recordId: string,
        payload: any,
        message?: string
    ) => Promise<any>;
    Patch: (payload: any, message?: string | undefined) => Promise<any>;
    Delete: (recordId: string, message?: string) => Promise<any>;
    Upload: (rawFile: any, message?: string) => Promise<any>;
}

const useActionCall = (url: string): ActionCallResponse => {
    const { navigate } = useQueryParams();
    const [loading, setLoading] = useState<boolean>(false);
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState<any>(null);

    const recoilInitialState = (): void => {
        setLoading(false);
        setError(null);
        setData(null);
    };

    const Post = useCallback(
        async (
            payload: any = {},
            message = "Created Successfull"
        ): Promise<any> => {
            recoilInitialState();
            try {
                const authToken = Lib.getCookies("session-token");
                setLoading(true);

                const response = await fetch(`${BASE_URL}${SERVICE[url] ?? url}`, {
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${authToken ?? ""}`,
                    },
                    method: "POST",
                    body: JSON.stringify(payload),
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        setLoading(false);
                        Lib.removeCookies("session-token")

                        const jData = await response.json();
                        toast.error(jData.message)
                        navigate.replace("/login");
                        return;
                    } else if (response.status === 500) {
                        setError('Server Error, Please Try Later')
                        throw new Error("Server Error, Please Try Later");
                    } else if (response.status === 400) {
                        setLoading(false);
                        const jData = await response.json();
                        toast.error(jData.message)
                        setError(jData.message)
                        return;
                    } else if (response.status === 422) {
                        setLoading(false);
                        const jData = await response.json();


                        const err: any = {};


                        for (const key in jData.errors) {
                            if (jData.errors[key] && jData.errors[key].length > 0) {
                                err[key] = jData.errors[key][0];
                            }
                        }

                        setError(err)
                        // toast.error(jData.message)
                        return;
                    } else {
                        throw new Error("Network Error");
                    }
                }
                if (message) {
                    toast.success(message);
                }
                const jsonData = await response.json();
                setData(jsonData);
                setLoading(false);
                return jsonData;
            } catch (error: any) {
                setLoading(false);


                toast.error(error.message)
                setError(error.message);
            }
        },
        [navigate, url]
    );

    const Put = useCallback(
        async (
            recordId = '',
            payload: any = {},
            message = "Updated Successfull"
        ): Promise<any> => {
            recoilInitialState();
            try {
                const authToken = Lib.getCookies("session-token");
                setLoading(true);

                const response = await fetch(`${BASE_URL}${SERVICE[url] ?? url}${recordId ? `/${recordId}` : ""}`, {
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${authToken ?? ""}`,
                    },
                    method: "PUT",
                    body: JSON.stringify(payload),
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        Lib.removeCookies("session-token")
                        navigate.replace("/login");
                        // throw new Error("Auth Error"); // Temporarily
                    } else if (response.status === 500) {
                        throw new Error("Server Error, Please Try Later");
                    } else if (response.status === 422) {
                        setLoading(false);
                        const jData = await response.json();


                        const err: any = {};

                        for (const key in jData.errors) {
                            if (jData.errors[key] && jData.errors[key].length > 0) {
                                err[key] = jData.errors[key][0];
                            }
                        }
                        setError(err)
                        // toast.error(jData.message)
                        return;
                    } else if (response.status === 400) {
                        setLoading(false);
                        const jData = await response.json();
                        toast.error(jData.message)
                        return;
                    } else {
                        throw new Error("Network Error");
                    }
                }
                if (message) {
                    toast.success(message);
                }
                const jsonData = await response.json();
                setData(jsonData);
                setLoading(false);
                return jsonData;
            } catch (error: any) {
                setLoading(false);

                toast.error(error.message)
                setError(error.message);
            }
        },
        [navigate, url]
    );
    const Patch = useCallback(
        async (
            payload: any = {},
            message = "Update Successfull"
        ): Promise<any> => {
            recoilInitialState();
            try {
                const authToken = Lib.getCookies("session-token");
                setLoading(true);

                const response = await fetch(`${BASE_URL}${SERVICE[url] ?? url}`, {
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${authToken ?? ""}`,
                    },
                    method: "PATCH",
                    body: JSON.stringify(payload),
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        setLoading(false);
                        Lib.removeCookies("session-token")

                        const jData = await response.json();
                        toast.error(jData.message)
                        navigate.replace("/login");
                        return;
                    } else if (response.status === 500) {
                        throw new Error("Server Error, Please Try Later");
                    } else if (response.status === 400) {
                        setLoading(false);
                        const jData = await response.json();
                        toast.error(jData.message)
                        return;
                    } else if (response.status === 422) {
                        setLoading(false);
                        const jData = await response.json();


                        const err: any = {};


                        for (const key in jData.errors) {
                            if (jData.errors[key] && jData.errors[key].length > 0) {
                                err[key] = jData.errors[key][0];
                            }
                        }

                        setError(err)
                        // toast.error(jData.message)
                        return;
                    } else {
                        throw new Error("Network Error");
                    }
                }
                if (message) {
                    toast.success(message);
                }
                const jsonData = await response.json();
                setData(jsonData);
                setLoading(false);
                return jsonData;
            } catch (error: any) {
                setLoading(false);


                toast.error(error.message)
                setError(error.message);
            }
        },
        [navigate, url]
    );
    const Delete = useCallback(
        async (
            recordId = '',
            message = "Updated Successfull"
        ): Promise<any> => {
            recoilInitialState();
            try {
                const authToken = Lib.getCookies("session-token");
                setLoading(true);

                const response = await fetch(`${BASE_URL}${SERVICE[url] ?? url}${recordId ? `/${recordId}` : ""}`, {
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${authToken ?? ""}`,
                    },
                    method: "DELETE",

                });

                if (!response.ok) {
                    if (response.status === 401) {
                        Lib.removeCookies("session-token")
                        navigate.replace("/login");
                        // throw new Error("Auth Error"); // Temporarily
                    } else if (response.status === 500) {
                        throw new Error("Server Error, Please Try Later");
                    } else if (response.status === 400) {
                        setLoading(false);
                        const jData = await response.json();
                        toast.error(jData.message)
                        return;
                    } else {
                        throw new Error("Network Error");
                    }
                }
                if (message) {
                    // toast.success(message);
                    const swalWithBootstrapButtons = Swal.mixin({
                        customClass: {
                            confirmButton: 'btn btn-secondary',
                            cancelButton: 'btn btn-dark ltr:mr-3 rtl:ml-3',
                            popup: 'sweet-alerts',
                        },
                        buttonsStyling: false,
                    });
                    swalWithBootstrapButtons.fire('Deleted!', message, 'success')
                }
                const jsonData = await response.json();
                setData(jsonData);
                setLoading(false);
                return jsonData;
            } catch (error: any) {
                setLoading(false);

                toast.error(error.message)
                setError(error.message);
            }
        },
        [navigate, url]
    );

    const Upload = (async (rawFile: any, message: string = "") => {
        recoilInitialState();

        try {

            const authToken = Lib.getCookies("session-token");
            setLoading(true);
            const formData = new FormData();
            formData.append("image", rawFile);

            const response = await fetch(`${BASE_URL}${SERVICE.UPLOAD}`, {
                headers: {
                    Authorization: `Bearer ${authToken ?? ""}`,
                },
                method: "POST",
                body: formData,
            });
            if (!response.ok) {
                if (response.status === 401) {
                    Lib.removeCookies("session-token")
                    navigate.replace("/login");
                    //throw new Error("Auth Error"); // Temporarily
                } else if (response.status === 500) {
                    throw new Error("Server Error, Please Try Later");
                } else if (response.status === 400) {
                    setLoading(false);
                    const jData = await response.json();
                    toast.error(jData.message);
                    return;
                } else {
                    throw new Error("Network Error");
                }
            }
            if (message) {

                toast.success(message);
            }
            const jsonData = await response.json();
            setData(jsonData);
            setLoading(false);
            return jsonData;
        } catch (error: any) {
            setLoading(false);

            setError(error.message);
            toast.error(message);
        }
    });

    return {
        loading,
        data,
        error,
        Post,
        Put,
        Delete,
        Upload,
        Patch
    };
}

export default useActionCall;