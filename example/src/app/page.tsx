"use client";
import {
  ConnectMultiButton,
  PayButton,
  Notification,
  useWalletAddress,
} from "bitcoin-wallet-adapter";
import Link from "next/link";

export default function Home() {
  const { cardinal_address, connected } = useWalletAddress();
  // console.log(connected, 'connected')
  const additionalItems = [
    <span onClick={() => console.log("Profile Clicked")}>
      {/* <FaUser /> */}
      <p className="bwa-ml-2 bwa-text-xs">Profile</p>
    </span>,
    <Link href="/settings" legacyBehavior>
      <a>
        <p className="bwa-text-xs">Settings</p>
      </a>
    </Link>,
  ];
  return (
    <main className="bg-primary flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <div>
          <ConnectMultiButton additionalMenuItems={additionalItems} />
        </div>
        {cardinal_address && connected && (
          <div className="py-6">
            <PayButton
              amount={5000}
              receipient={"bc1qrwtu9ec4sl6txnxqhvgmuavm72gv32jsaz2mks"}
            />
          </div>
        )}
      </div>
      <Notification />
    </main>
  );
}
