import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Admin Panel",
  description: "Admin panel layout for the application",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header>
          <nav>
            {/* Add your navigation bar here */}
            <h1>Admin Panel</h1>
          </nav>
        </header>
        <main>{children}</main>
        <footer>
          {/* Add your footer here */}
          <p>© 2023 Your Company</p>
        </footer>
      </body>
    </html>
  );
}
