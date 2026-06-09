import { createContext, useContext, useState } from "react";

type UserContextData = {
    userName: string;
    setUserName: (name: string) => void;
    userToken: string,
    setUserToken: (name: string) => void;
};

const UserContext = createContext<UserContextData | undefined>(undefined);

type UserProviderProps = {
    children: React.ReactNode;
};

export function UserProvider({ children }: UserProviderProps) {
    const [userName, setUserName] = useState(() => {
        const stored = localStorage.getItem("user")
        if (!stored) return ""

        try {
            const parsed = JSON.parse(stored)
            return parsed?.user?.name ?? ""
        } catch {
            return ""
        }
    })
    const [userToken, setUserToken] = useState(() => {
        const stored = localStorage.getItem("user")
        if (!stored) return ""

        try {
            const parsed = JSON.parse(stored)
            return parsed?.user?.token ?? ""
        } catch {
            return ""
        }
    })

    return (
        <UserContext.Provider
            value={{
                userName,
                setUserName,
                userToken,
                setUserToken
            }}
        >
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);

    if (!context) {
        throw new Error("useUser deve ser usado dentro de UserProvider");
    }

    return context;
}