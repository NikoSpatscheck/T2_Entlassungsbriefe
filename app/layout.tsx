import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/auth/auth-provider";
import { TopNavigation } from "@/components/navigation/top-navigation";
import { getSessionUser } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "OncoSimplify – Entlassungsbrief einfach erklärt",
  description: "Ein ruhiger, verständlicher Prototyp zum besseren Verstehen von Entlassungsbriefen.",
  icons: {
    icon: [{ url: "/favicon_Logo.png", type: "image/png" }],
    shortcut: ["/favicon_Logo.png"],
    apple: [{ url: "/favicon_Logo.png" }],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const sessionUser = await getSessionUser();

  return (
    <html lang="de">
      <body className="bg-purple-50 antialiased">
        <AuthProvider initialUser={sessionUser}>
          <TopNavigation />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
