import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ErrorBoundary } from "@/components/ui";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Chatelio - Chatbot as a Service",
  description: "Multi-tenant chatbot platform for businesses",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-auth-900`}>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}
