"use client";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";
import { useEffect, useState } from "react";

const ThemeProviders = ({
  children,
  attribute,
  defaultTheme,
  enableSystem,
}: ThemeProviderProps) => {
  const [mounted, setMounted] = useState(false);

  // Pour éviter les avertissements côté serveur, attendre que le client soit monté
  useEffect(() => {
    setMounted(true);
  }, []);

  // Si non monté, ne pas renvoyer de contenu (évite les écarts de rendu côté serveur et client)
  if (!mounted) {
    return <>{children}</>;
  }
  return (
    <NextThemeProvider
      attribute={attribute}
      defaultTheme={defaultTheme}
      enableSystem={enableSystem}
    >
      {children}
    </NextThemeProvider>
  );
};

export default ThemeProviders;
