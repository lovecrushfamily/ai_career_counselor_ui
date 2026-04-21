import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Theme = "dark" | "light";

/**
 * Bump THEME_VERSION khi muốn force RESET theme cho TẤT CẢ user
 * (kể cả người đã chọn dark trước đó).
 */
const THEME_VERSION = "v2-light-default";
const VERSION_KEY = "mp-theme-version";
const THEME_KEY = "mp-theme";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "light",
  toggleTheme: () => {},
  setTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === "undefined") return "light";
    const storedVersion = localStorage.getItem(VERSION_KEY);
    if (storedVersion !== THEME_VERSION) {
      localStorage.setItem(VERSION_KEY, THEME_VERSION);
      localStorage.setItem(THEME_KEY, "light");
      return "light";
    }
    return (localStorage.getItem(THEME_KEY) as Theme) || "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("dark", "light");
    root.classList.add(theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const setTheme = (t: Theme) => setThemeState(t);
  const toggleTheme = () => setThemeState((t) => (t === "dark" ? "light" : "dark"));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
