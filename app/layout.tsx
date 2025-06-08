// app/layout.tsx
import "./globals.css";
import Script from "next/script";
import Header from "./Header";
import Providers from "./providers";
import { ThemeProvider } from "./theme-provider";

export const metadata = {
  title: "Superblog",
  description: "A blog app using Next.js and Prisma",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <Script src="http://localhost:8097" strategy="afterInteractive" />
      </head>
      <body className="dark:bg-gray-900 text-gray-100 min-h-screen">
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
