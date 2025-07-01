import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Providers from "@/components/Providers";
import NotificationManager from "@/components/NotificationManager";
import ToastContainer from "@/components/Toast";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "CleanTabs | Minimal Site Organization Platform",
  description: "Clean, simple site organization with drag & drop functionality",
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: '/icon-192x192.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased h-full bg-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900 dark:bg-gradient-to-br`}>
        <Providers>
          <NotificationManager />
          <ToastContainer />
          {children}
        </Providers>
      </body>
    </html>
  );
}