"use client";
import "./globals.css";
import { WalletProvider, setupDevTools } from "../../../dist";
import { useEffect } from "react";

function DevToolsInitializer() {
  useEffect(() => {
    // Initialize Redux DevTools for development
    setupDevTools();
  }, []);
  
  return null;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WalletProvider>
      <html lang="en">
        <body>
          <DevToolsInitializer />
          {children}
        </body>
      </html>
    </WalletProvider>
  );
}
