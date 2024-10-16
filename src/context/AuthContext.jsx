import { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { myConstant } from "../const/const";
import { Spinner } from "react-bootstrap";

export const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext = () => {
    return useContext(AuthContext);
}

export const AuthContextProvider = ({ children }) => {
    const [authUser, setAuthUser] = useState(null);
    const [loading, setLoading] = useState(true); // Initialize loading state

    useEffect(() => {
        const fetchUserData = async () => {
            const storedData = localStorage.getItem("events-app");
            if (storedData) {
                const { token } = JSON.parse(storedData);
                if (token) {
                    try {
                        const response = await fetch(myConstant + "/api/user", {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`,
                            },
                        });

                        if (response.ok) {
                            const userData = await response.json();
                            setAuthUser({ token, ...userData });
                        } else {
                            toast.error("Something went wrong 😔");
                            console.error("Failed to fetch user data:", response.statusText);
                        }
                    } catch (error) {
                        toast.error("Sorry, something went wrong 😔");
                        console.error("Error fetching user data:", error);
                    }
                }
            }
            setLoading(false); // Set loading to false after the fetch is done
        };

        fetchUserData();
    }, []);

    return (
        <AuthContext.Provider value={{ authUser, setAuthUser, loading }}>
            {loading ? (
                <div className="w-screen h-screen flex justify-center items-center">
                    <p className="text-blue-500">loading...</p>
                    <Spinner className="loading-indicator"></Spinner>
                </div>
            ) : (
                children
            )}
        </AuthContext.Provider>
    );
}