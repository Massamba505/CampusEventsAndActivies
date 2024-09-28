import { useState } from "react"
import toast from "react-hot-toast";
import {useAuthContext} from "../context/AuthContext.jsx";
import { myConstant } from "../const/const.js";


export const useLogout = ()=>{
    const [loading,setLoading] = useState(false);

    const {setAuthUser} = useAuthContext();

    const logout = async()=>{
        setLoading(true);
        try {
            const res = await fetch(myConstant + "api/auth/logout",{
                method: "POST",
                headers: {"Content-Type":"application/json"}
            });
            const data = await res.json();
            if(data.error){
                throw new Error(data.error);
            }

            localStorage.removeItem("events-app");
            toast.success('Logout successful');
            setAuthUser(null);
        } catch (error) {
            toast.error(error.message);
        }
        finally{
            setLoading(false);
        }
    }

    return {loading, logout};
}