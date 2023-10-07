"use client";
import {
  ConnectMultiButton,
  PayButton,
  Notification,
  useWalletAddress,
} from "bitcoin-wallet-adapter";

export default function Home() {
  const { cardinal_address, connected } = useWalletAddress();
  // console.log(connected, 'connected')
  return (
    <main className="bg-primary flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <div>
          <ConnectMultiButton />
        </div>
        {cardinal_address && connected && (
          <div className="py-6">
            <PayButton
              amount={5000}
              receipient={"bc1qrwtu9ec4sl6txnxqhvgmuavm72gv32jsaz2mks"}
              sender={cardinal_address}
            />
          </div>
        )}
      </div>
      <Notification />
    </main>
  );
}
