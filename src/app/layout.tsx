import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SpendLens - AI Spend Audit for Startups",
  description: "Audit your AI stack in 90 seconds and uncover hidden savings. Free tool for startups to optimize Cursor, ChatGPT, Claude, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
      style={{ colorScheme: 'dark' }}
    >
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-50">
        <div className="gradient-mesh fixed inset-0 -z-10" />
        {children}
      </body>
    </html>
  );
}
