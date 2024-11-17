import type { Metadata } from "next";
// import { Inter } from "next/font/google";
import { AppProvider } from '@/contexts/app-context';
import { ToastContainer } from "react-toastify";
import { Navbar } from '@/components/navbar';
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

// const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "KonMari - Rubbish Pickup Management",
  description: "Efficient rubbish pickup management solution",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AppProvider>
          <Navbar />
          {children}
          <ToastContainer position="top-right" />
        </AppProvider>
      </body>
    </html>
  );
}
