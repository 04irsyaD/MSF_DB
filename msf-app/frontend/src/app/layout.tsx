import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "../styles/globals.css";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
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
        {/* Sidebar Left */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 min-h-screen relative overflow-x-hidden">
          {/* Subtle glowing ambient spots */}
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-900/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none" />

          <Header />
          
          <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto relative z-10">
            {children}
          </main>
        </div>

        {/* Sonner Toast Notifications */}
        <Toaster position="bottom-right" theme="dark" closeButton richColors />
      </body>
    </html>
  );
}
