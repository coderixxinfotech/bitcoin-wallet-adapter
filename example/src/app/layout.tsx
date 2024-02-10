"use client";
import "./globals.css";
import { WalletProvider } from "../../../dist";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WalletProvider
      // mempoolUrl="https://mempool.space/api"
      customAuthOptions={{
        appDetails: {
          name: "Example",
        },
      }}
    >
      <html lang="en">
        <body>{children}</body>
      </html>
    </WalletProvider>
  );
}
