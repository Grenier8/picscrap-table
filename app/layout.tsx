// app/layout.tsx
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./Header";
import Providers from "./providers";
import { ThemeProvider } from "./theme-provider";

export const metadata = {
  title: "Picscrap",
  description: "Web scraping app",
};

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.className} dark`}>
      <head></head>
      <body className="font-sans dark:bg-gray-900 text-gray-100 min-h-screen">
        <ThemeProvider>
          <Providers>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">{children}</main>
            </div>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
