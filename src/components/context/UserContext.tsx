import Cookies from "js-cookie";
import { createContext, useEffect, useState } from "react";

export const UserContext = createContext<any | null>(null);
export const UserProvider = ({ children }: { children: any }) => {
    const [user, setUser] = useState();
    const [admin, setAdmin] = useState();
    useEffect(() => {
        const users = Cookies.get("admin") as unknown as string;
        if (users !== undefined) {
            setAdmin(JSON.parse(users));
        }
    }, []);
    return (
        <UserContext.Provider value={{ user, setUser, admin, setAdmin }}>
            {children}
        </UserContext.Provider>
    );
};
