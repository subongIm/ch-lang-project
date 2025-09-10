import type { Metadata } from "next";
import "./globals.css";
import { Navigation } from "../shared/components/Navigation";

export const metadata: Metadata = {
  title: "중국 예능 학습 웹앱",
  description: "타임라인 중심의 중국 예능 학습 플랫폼",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="dark">
      <body className="antialiased bg-background text-foreground">
        <div className="min-h-screen">
          <Navigation />
          {children}
        </div>
      </body>
    </html>
  );
}