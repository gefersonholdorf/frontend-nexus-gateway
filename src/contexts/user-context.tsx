import { createContext, useContext, useState } from "react";

type UserContextData = {
    userName: string;
    setUserName: (name: string) => void;
};

const UserContext = createContext<UserContextData | undefined>(undefined);

type UserProviderProps = {
    children: React.ReactNode;
};

export function UserProvider({ children }: UserProviderProps) {
    const [userName, setUserName] = useState("");

    return (
        <UserContext.Provider
            value={{
                userName,
                setUserName,
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