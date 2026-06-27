import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Orbi — Your student life, in one inbox",
  description:
    "Orbi brings Canvas, Gmail, Discord, GroupMe, and Google Calendar into one AI-powered inbox.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
