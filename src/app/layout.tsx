import "@/app/globals.css";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "52% - 记录人际关系中的重要细节",
  description: "通过自然交流获取的信息，记录并温暖地呈现人与人之间关系的细节，避免侵入式记录方式，强调情感温度和真实记忆。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="font-sans">{children}</body>
    </html>
  );
}
