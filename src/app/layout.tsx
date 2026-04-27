import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Emoji 组合器 — Emoji Kitchen",
  description: "选择两个 Emoji，碰撞出奇妙火花！基于 Google Emoji Kitchen 的免费表情组合工具。",
  keywords: ["emoji", "emoji mix", "emoji kitchen", "表情组合", "emoji 组合器"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#0f0f23] text-[#f0f0f5]">
        {children}
      </body>
    </html>
  );
}
