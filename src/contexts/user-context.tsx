import { createContext, useContext, useEffect, useState } from "react";

interface User {
    email: string
    name: string,
    roles: string[]
    permissions: string[]
    token: string
}

type UserContextData = {
    user: User | null;
    setUser: (name: User | null) => void;
    isAuthenticated: boolean;
};

const UserContext = createContext<UserContextData | undefined>(undefined);

type UserProviderProps = {
    children: React.ReactNode;
};

export function UserProvider({ children }: UserProviderProps) {
    const [user, setUser] = useState<User | null>(() => {
        const stored = localStorage.getItem("user");

        if (!stored) return null;

        try {
            const parsed = JSON.parse(stored) as User;

            return parsed;
        } catch {
            return null;
        }
    });

    useEffect(() => {
        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
        } else {
            localStorage.removeItem("user");
        }
    }, [user]);

    const isAuthenticated = !!user?.token;

    return (
        <UserContext.Provider
            value={{
                user,
                setUser,
                isAuthenticated,
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