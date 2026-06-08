import type { Metadata } from "next";
import { Hanken_Grotesk } from "next/font/google";
import "./globals.css";

const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-hanken",
});

export const metadata: Metadata = {
  title: "InkCraft by David | Shop Custom Apparel",
  description: "Premium print-on-demand custom apparel. High-fidelity production for artists who refuse to compromise on quality.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
      </head>
      <body className={`${hankenGrotesk.variable} font-[family-name:var(--font-hanken)] antialiased overflow-x-hidden`}>
        {children}
      </body>
    </html>
  );
}
