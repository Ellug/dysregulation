import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { UsersProvider } from "@/contexts/UsersContext"
import { RouteGuard } from "@/components/RouteGuard";
import { NewMessageProvider } from "@/contexts/NewMessageContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Google Sheet",
  description: "dysregulation",
  manifest: "/manifest.json",
  themeColor: "#000000",  
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <UsersProvider>
            <NewMessageProvider>
              <RouteGuard>{children}</RouteGuard>
            </NewMessageProvider>
          </UsersProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
