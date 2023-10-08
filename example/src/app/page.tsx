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
          <ConnectMultiButton
            walletImageClass="w-[60px]"
            walletLabelClass="pl-3 font-bold text-xl"
            walletItemClass="border w-full md:w-6/12 cursor-pointer border-transparent rounded-xl mb-4 hover:border-green-500 transition-all"
            headingClass="text-green-700 text-4xl pb-12 font-bold text-center"
            buttonClassname="bg-green-300 hover:bg-green-400 rounded-xl flex items-center text-green-800 px-4 py-1 font-bold"
          />
        </div>
        {cardinal_address && connected && (
          <div className="py-6">
            <PayButton
              amount={5000}
              receipient={"bc1qrwtu9ec4sl6txnxqhvgmuavm72gv32jsaz2mks"}
              buttonClassname="bg-green-300 hover:bg-green-400 rounded-xl flex items-center text-green-800 px-4 py-1 font-bold"
            />
          </div>
        )}
      </div>
      <Notification />
    </main>
  );
}
