import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "../styles/globals.css";
import AppLayout from "@/components/layout/AppLayout";
import { Toaster } from "sonner";
import UnderConstructionModal from "@/components/common/UnderConstructionModal";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "MSF DB — AI Database Documentation",
  description:
    "Generate dokumentasi database secara otomatis menggunakan AI lokal. Support PostgreSQL, MySQL, SQLite, dan SQL Server.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans min-h-screen bg-background text-foreground antialiased`}
      >
        <AppLayout>{children}</AppLayout>

        {/* Under Construction Popup */}
        <UnderConstructionModal />

        {/* Sonner Toast Notifications */}
        <Toaster position="bottom-right" theme="light" closeButton richColors />
      </body>
    </html>
  );
}
