import type { Metadata } from "next";
import localFont from "next/font/local";
import "../globals.css";
import { ReactNode } from "react";
import { Providers } from "../providers";
import Navbar from "@/components/NavBar";

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "SIMS PPOB | IKRAM TAUFFIQUL HAKIM ",
  description: "SIMS PPOB",
};

interface Props {
  readonly children: ReactNode;
}

export default function RootLayout({ children }: Props) {
  const logo = "/Logo.png";
  const logoText = "SIMS PPOB";
  const dashboardPath = "/dashboard";
  const links = [
    { path: "/topup", text: "Top Up" },
    { path: "/transaction", text: "Transaction" },
    { path: "/account", text: "Akun" },
  ];
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Navbar logo={logo} logoText={logoText} dashboardPath={dashboardPath} links={links} />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
