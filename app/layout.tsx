import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Entlassungsbrief einfach erklärt",
  description: "Ein ruhiger, verständlicher Prototyp zum besseren Verstehen von Entlassungsbriefen.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className="bg-purple-50 antialiased">{children}</body>
    </html>
  );
}
