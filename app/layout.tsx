import { CartProvider } from "@/context/CartContext";
import AuthProvider from "@/providers/auth-provider";
import QueryProvider from "@/providers/query-provider";
import ThemeProviders from "@/providers/ThemeProviders";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Spinosor Records",
  description: "Label for independent artists",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-black">
      <QueryProvider>
        <AuthProvider>
          <CartProvider>
            <body className={inter.className}>
              <ThemeProviders>{children}</ThemeProviders>
            </body>
          </CartProvider>
        </AuthProvider>
      </QueryProvider>
    </html>
  );
}
