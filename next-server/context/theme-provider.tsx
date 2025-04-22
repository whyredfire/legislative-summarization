"use client";

import {
  createContext,
  useEffect,
  useState,
  useCallback,
  JSX,
  ReactElement,
} from "react";

interface ThemeContextType {
  isDarkTheme: boolean;
  toggleThemeHandler: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  isDarkTheme: true,
  toggleThemeHandler: () => {},
});

interface ThemePropsInterface {
  children?: JSX.Element | Array<JSX.Element>;
}

// inspired from https://javascript.plainenglish.io/how-to-implement-dark-light-themes-in-a-next-js-app-using-context-hook-tailwindcss-336558dd4579
export function ThemeProvider({ children }: ThemePropsInterface): ReactElement {
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(true);

  useEffect(() => {
    const storedTheme = localStorage.getItem("isDarkTheme");
    const dark = storedTheme === null || storedTheme === "true";
    setIsDarkTheme(dark);
    document.body?.classList.toggle("dark", dark);
  }, []);

  const toggleThemeHandler = useCallback(() => {
    const newTheme = !isDarkTheme;
    setIsDarkTheme(newTheme);
    localStorage.setItem("isDarkTheme", JSON.stringify(newTheme));
    document.body?.classList.toggle("dark", newTheme);
  }, [isDarkTheme]);

  return (
    <ThemeContext.Provider value={{ isDarkTheme, toggleThemeHandler }}>
      {children}
    </ThemeContext.Provider>
  );
}

export default ThemeContext;
