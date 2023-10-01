'use client'
import './globals.css'
import { WalletProvider } from "bitcoin-wallet-adapter";


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <WalletProvider customAuthOptions={{
      appDetails: {
      name: "Example"
    }}}>
      <html lang="en">
        <body>{children}</body>
      </html>
    </WalletProvider>
  );
}
