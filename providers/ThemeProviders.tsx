"use client";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";

const ThemeProviders = ({
    children,
    attribute,
    defaultTheme,
    enableSystem
}: ThemeProviderProps) => {
    return (
        <NextThemeProvider
            attribute={attribute}
            defaultTheme={defaultTheme}
            enableSystem={enableSystem}
        >
            {children}
        </NextThemeProvider>
    )
};

export default ThemeProviders;