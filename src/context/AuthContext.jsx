import { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { myConstant } from "../const/const";

export const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }) => {
    const [authUser, setAuthUser] = useState(null);
    const [loading, setLoading] = useState(true);
    // const location = useLocation();

    useEffect(() => {
        const fetchUserData = async () => {
            const storedData = localStorage.getItem("events-app");
            if(!storedData){
                setAuthUser(null);
                setLoading(false);
                return;
            }
            const token = JSON.parse(storedData)["token"];
            if (!token){
                setAuthUser(null);
                setLoading(false);
                return;
            }

            if (authUser){
                const mytoken = authUser.token;
                if(mytoken === token){
                    setLoading(false);
                    return;
                }
                else{
                    localStorage.removeItem("events-app");
                    setAuthUser(null);
                    setLoading(false);
                    return;
                }
            }


            try {
                const response = await fetch(`${myConstant}/api/user`, {
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
                    console.error("Failed to fetch user data:", response.statusText);
                    toast.error("Unable to load user data 😔");
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
                toast.error("Error loading user data 😔");
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [authUser]);
    
    return (
        <AuthContext.Provider value={{ authUser, setAuthUser,loading}}>
            {children}
        </AuthContext.Provider>
    );
}
