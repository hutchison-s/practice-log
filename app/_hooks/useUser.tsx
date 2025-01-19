import { useContext } from "react";
import { UserContext } from "../_contexts/UserContext";

export const useUser = ()=>{
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("Must be used within scope of UserProvider")
    }
    return context;
}