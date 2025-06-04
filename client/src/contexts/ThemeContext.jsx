import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Get theme from localStorage or default to 'dark'
    const savedTheme = localStorage.getItem("theme");
    return savedTheme || "dark";
  });

  useEffect(() => {
    // Save theme to localStorage whenever it changes
    localStorage.setItem("theme", theme);

    // Update CSS custom properties based on theme
    const root = document.documentElement;
    if (theme === "light") {
      root.style.setProperty("--bg-primary", "#ffffff");
      root.style.setProperty("--bg-secondary", "#f5f5f5");
      root.style.setProperty("--text-primary", "#333333");
      root.style.setProperty("--text-secondary", "#666666");
      root.style.setProperty("--border-color", "#e0e0e0");
      root.style.setProperty("--card-bg", "rgba(255, 255, 255, 0.9)");
      root.style.setProperty("--card-border", "rgba(0, 0, 0, 0.1)");
      root.style.setProperty("--shadow-color", "rgba(0, 0, 0, 0.1)");
    } else {
      root.style.setProperty("--bg-primary", "#000000");
      root.style.setProperty("--bg-secondary", "#1a1a1a");
      root.style.setProperty("--text-primary", "#ffffff");
      root.style.setProperty("--text-secondary", "#cccccc");
      root.style.setProperty("--border-color", "rgba(255, 255, 255, 0.2)");
      root.style.setProperty("--card-bg", "rgba(255, 255, 255, 0.1)");
      root.style.setProperty("--card-border", "rgba(255, 255, 255, 0.2)");
      root.style.setProperty("--shadow-color", "rgba(255, 255, 255, 0.1)");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const value = {
    theme,
    toggleTheme,
    isLight: theme === "light",
    isDark: theme === "dark",
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
