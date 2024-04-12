import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from './providers'

import Nav from "@/components/navbar"
import SmallWithLogoLeft from '@/components/footer';

export const metadata: Metadata = {
  title: "CrowdFund. Kickstart your decentralized project today!",
  description: "CrowdFund. Decentralized crowdfunding dapp on blockchain!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers >
        <Nav/>
          {children}
          <SmallWithLogoLeft/>
        </Providers>
        </body>
    
    </html>
  );
}
