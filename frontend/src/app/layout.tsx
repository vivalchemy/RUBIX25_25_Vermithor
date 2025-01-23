import type { Metadata } from "next";
import NavBar from "@/components/home/NavBar";
import { Poppins, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  weight: '400',
  variable: '--font-poppins',
  subsets: ['latin']
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${jetBrainsMono.variable} antialiased`}>
        <NavBar />
        {children}
      </body>
    </html>
  );
}
//className={`${poppins.variable} ${jetBrainsMono.variable} antialiased`}
