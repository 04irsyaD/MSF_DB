import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "../styles/globals.css";
import AppLayout from "@/components/layout/AppLayout";
import { Toaster } from "sonner";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "MSF_DB — AI Database Documentation",
  description: "Generate beautiful, comprehensive database documentation and run smart queries with local AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${outfit.variable} font-sans min-h-screen bg-background text-foreground antialiased flex`}
      >
        <AppLayout>{children}</AppLayout>

        {/* Sonner Toast Notifications */}
        <Toaster position="bottom-right" theme="dark" closeButton richColors />
      </body>
    </html>
  );
}
