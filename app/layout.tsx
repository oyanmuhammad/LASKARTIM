import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LASKARTIM - Layanan Aspirasi Karang Baru Timur",
  description:
    "Platform transparansi publik untuk menyampaikan aspirasi, keluhan, dan saran pembangunan Desa Karang Baru Timur, Lombok Timur yang lebih baik. Dipersembahkan oleh Karang Baru Timur X KKN 31 FTEK UNHAZ.",
  keywords: [
    "LASKARTIM",
    "Karang Baru Timur",
    "Lombok Timur",
    "Aspirasi Desa",
    "Transparansi Publik",
    "KKN UNHAZ",
  ],
  authors: [{ name: "Karang Baru Timur X KKN 31 FTEK UNHAZ" }],
  openGraph: {
    title: "LASKARTIM - Layanan Aspirasi Karang Baru Timur",
    description:
      "Platform transparansi publik untuk pembangunan desa yang lebih baik",
    type: "website",
    locale: "id_ID",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning data-scroll-behavior="smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
