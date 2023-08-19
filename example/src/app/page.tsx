"use client";
import { ConnectMultiButton } from "bitcoin-wallet-adapter";

export default function Home() {
  return (
    <main className="bg-gray-100 flex min-h-screen flex-col items-center justify-between p-24">
      <ConnectMultiButton />
    </main>
  );
}
