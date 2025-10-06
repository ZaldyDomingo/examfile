import { Inter } from "next/font/google";
import ClientThemeProvider from "./ThemeProvider";
import { AuthProvider } from "../lib/auth";
import Navigation from "../components/Navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Blog App",
  description: "A simple blog application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientThemeProvider>
          <AuthProvider>
            <Navigation />
            {children}
          </AuthProvider>
        </ClientThemeProvider>
      </body>
    </html>
  );
}
