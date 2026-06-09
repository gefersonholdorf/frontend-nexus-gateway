import { createContext, useContext, useEffect, useState } from "react";

type Theme = "clean" | "dark";

type ThemeContextData = {
    theme: Theme;
    handleSetTheme: (name: Theme) => void;
};

const ThemeContext = createContext<ThemeContextData | undefined>(undefined);

type ThemeProviderProps = {
    children: React.ReactNode;
};

export function ThemeProvider({ children }: ThemeProviderProps) {
    const [theme, setTheme] = useState<Theme>(() => {
        const stored = localStorage.getItem("theme");
        return stored === "dark" || stored === "clean" ? stored : "clean";
    });

    function handleSetTheme(theme: 'clean' | 'dark') {
        setTheme(theme)
    }

    useEffect(() => {
        localStorage.setItem("theme", theme);
        document.documentElement.classList.toggle("dark", theme === "dark");
    }, [theme]);    

    return (
        <ThemeContext.Provider value={{ theme, handleSetTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error("useTheme deve ser usado dentro de ThemeProvider");
    }

    return context;
}