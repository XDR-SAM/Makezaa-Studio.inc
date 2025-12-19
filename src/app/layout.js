import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "Makezaa - Professional Web Development & Digital Marketing Agency",
  description: "Makezaa is a professional agency providing web development services, SEO optimization, and digital marketing solutions for clients in US, Canada, and EU.",
  keywords: "web development, SEO, digital marketing, agency, US, Canada, EU",
  authors: [{ name: "Makezaa Agency" }],
  openGraph: {
    title: "Makezaa - Professional Web Development & Digital Marketing Agency",
    description: "Professional web development, SEO, and digital marketing services for businesses worldwide.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </body>
    </html>
  );
}
