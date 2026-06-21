import {createContext,useState } from "react";

export const AuthContext=createContext();

export const AuthProvider=({children})=>{
    // const [user,setUser]=useState(JSON.parse(localStorage.getItem("user")));
    const [user,setUser]=useState(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser || storedUser === "undefined") {
        return null;
    }

    return JSON.parse(storedUser);
});
    const login=(data)=>{
        localStorage.setItem(
            "token",data.token
        );
        localStorage.setItem(
            "user",
            JSON.stringify(data.user)
        );
        setUser(data.user);
    };
    const logout=()=>{
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
    };
    return(
        <AuthContext.Provider value={{
            user,
            login,
            logout
        }}> {children}
        </AuthContext.Provider>
    )
}