import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google"; // Commented out as not directly used for theme provider
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"; // New: Import ThemeProvider
import Header from "@/components/layout/Header"; // New: Import Header component
import Footer from "@/components/layout/Footer"; // New: Import Footer component
import { ClerkProvider } from '@clerk/nextjs'; // New: Import ClerkProvider

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "TradeConnect", // Modified title
  description: "AI-Powered B2B Marketplace", // Modified description
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider> {/* New: Wrap the entire application with ClerkProvider */} 
      <html lang="en" suppressHydrationWarning> {/* New: suppressHydrationWarning for ThemeProvider */} 
        <body
          // className={`${geistSans.variable} ${geistMono.variable} antialiased`} // Commented out font classes
          className="min-h-screen flex flex-col"
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Header /> {/* New: Render Header component */}
            <main className="flex-grow">{children}</main> {/* Modified: Added main tag with flex-grow */}
            <Footer /> {/* New: Render Footer component */}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
