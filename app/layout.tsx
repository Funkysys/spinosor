import { CartProvider } from "@/context/CartContext";
import AuthProvider from "@/providers/auth-provider";
import QueryProvider from "@/providers/query-provider";
import ThemeProviders from "@/providers/ThemeProviders";
import { Belleza, Ruda } from "@next/font/google";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Spinosor Records",
  description: "Label for independent artists",
};
const belleza = Belleza({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-belleza",
});

const ruda = Ruda({
  subsets: ["latin"],
  weight: ["400", "700"], // Choisissez les poids désirés
  variable: "--font-ruda",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-perso-bg">
      <QueryProvider>
        <AuthProvider>
          <CartProvider>
            <body
              className={`${belleza.variable} ${ruda.variable} ${inter.className} min-h-[100vh]`}
            >
              <ThemeProviders>{children}</ThemeProviders>
            </body>
          </CartProvider>
        </AuthProvider>
      </QueryProvider>
    </html>
  );
}
