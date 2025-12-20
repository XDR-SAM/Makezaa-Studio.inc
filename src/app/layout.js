import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Toaster } from "react-hot-toast";
import ConditionalLayout from "@/components/layout/ConditionalLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Makezaa - Web Development, SEO & Digital Marketing Agency",
  description: "Professional web development services, SEO optimization, and digital marketing solutions for businesses in the US, Canada, and EU.",
  keywords: "web development, SEO, digital marketing, agency, US, Canada, EU",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <ConditionalLayout>
          {children}
        </ConditionalLayout>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
