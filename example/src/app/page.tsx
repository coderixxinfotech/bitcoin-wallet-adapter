"use client";
import {
  ConnectMultiButton,
  PayButton,
  Notification,
  useWalletAddress,
  useXverseSign,
} from "../../../dist";
import Link from "next/link";
import { useEffect } from "react";
import { IoLogoDiscord } from "react-icons/io5";
import {
  FaDiscord,
  FaFaceFrown,
  FaFaceGrinStars,
  FaFaceMeh,
  FaFaceSadCry,
  FaFaceSmile,
  FaFaceSmileWink,
  FaSquareXTwitter,
  FaXTwitter,
} from "react-icons/fa6";

import Popover from "@mui/material/Popover";

const XverseListingUnsignedPsbt = `cHNidP8BAFMCAAAAAY2eAJfNX305iLS3wcoAydSV3fLlswhTOSnzauI4ifaJAAAAAAD/////AQAGAAAAAAAAF6kUaCZjDq3CEhgAUJgHq4l+MlIpLE6HAAAAAAABAP04AQIAAAAAAQKCZJHc5/82iQQLBIHwTadgrr39ldYYP7oQ7WBUVPIZsQIAAAAA/////8TKUqFN+i6clUthqwHTNKoN86U7s4Iuczoriu2hRCSwAAAAAAD/////AiICAAAAAAAAIlEgwamNg/SRfxhid+iPbO5aaTYRwwH44Wj8KsAVHnC0s6UhhAEAAAAAACJRIBL2sGjymEcmEx43URFfN125o87nIsYtoisohjZsr6oZAUCffKRpcm9qKUyTeKmjrtumKD4cjhBkbypE2Z5Y/naaZkG6lfbIBsy/Gcz5SD4LBeTpmcNvD3JmlfZ8+dNCkdl+AUBxSjJPgeUsk6r4Yy4RI+W1L/INM6V6jMfL97LVTyhFpAVEGBbU+khU1Pje2KdhJ6MFTBmbiVbC9Xf6g+srKLq1AAAAAAEBKyICAAAAAAAAIlEgwamNg/SRfxhid+iPbO5aaTYRwwH44Wj8KsAVHnC0s6UBAwSDAAAAARcgs/+suUVx8rIh8UZRFajDjzxJ7oujixupMPNuRHpgWbwAAA==`;

export default function Home() {
  const { loading, result, error, sign } = useXverseSign();
  const walletDetails = useWalletAddress();
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

  const handleClick = async () => {
    try {
      if (walletDetails) {
        const { cardinal_address, ordinal_address } = walletDetails;
        if (!cardinal_address) return;
        const options: any = {
          psbt: XverseListingUnsignedPsbt,
          network: "Mainnet",
          // action: "sell",
          inputs: [
            {
              address: ordinal_address,
              sighash: 131,
              index: [0],
            },
          ],
        };

        await sign(options);
      }
    } catch (e) {
      console.error("An error occurred:", error);
    }
  };

  useEffect(() => {
    console.log({ result, error });
    console.log("Signing successful:", result);
  }, [result, error]);

  return (
    <main className="bg-primary flex min-h-screen flex-col items-center justify-between px-24 py-12">
      <div className="w-full">
        <div className="w-full flex justify-end">
          <ConnectMultiButton
            modalContentClass="bg-primary border rounded-xl border-accent overflow-hidden relative lg:p-16 md:p-12 p-6"
            buttonClassname={` text-white rounded flex items-center px-4 py-1 ${
              walletDetails
                ? "  font-bold bg-accent_dark "
                : " font-light bg-accent"
            }`}
            additionalMenuItems={additionalItems}
            headingClass="text-center text-white pt-2 pb-2 text-3xl capitalize font-bold mb-4"
            walletItemClass="w-full bg-accent_dark my-3 hover:border-accent border border-transparent cursor-pointer"
            walletLabelClass="text-lg text-white capitalize tracking-wider"
            walletImageClass="w-[30px]"
            InnerMenu={InnerMenu}
          />
        </div>
        {walletDetails &&
          walletDetails.cardinal_address &&
          walletDetails.connected && (
            <div className="py-6">
              <PayButton
                amount={5000}
                receipient={"bc1qrwtu9ec4sl6txnxqhvgmuavm72gv32jsaz2mks"}
              />
            </div>
          )}

        {loading && <p>Loading...</p>}

        {walletDetails &&
          walletDetails.ordinal_address &&
          walletDetails.connected && (
            <div className="py-6">
              <button
                className="bg-blue-500 px-4 py-4 rounded shadow hover:bg-blue-700"
                onClick={handleClick}
                disabled={loading}
              >
                Sign Transaction
              </button>
            </div>
          )}
        {result && (
          <p className="text-xs bwa-overflow-scroll px-4 py-1 bg-green-200 text-green-700 rounded shadow">
            Success
          </p>
        )}
        {error && (
          <span className="py-1 px-4 bg-red-200 text-red-700 rounded shadow">
            Error: {error.message}
          </span>
        )}
      </div>
      <Notification />
    </main>
  );
}

const Face = ({ balance }: { balance: number }) => {
  let balInBTC = balance / 100_000_000;

  console.log({ balInBTC }, "BTCBAL");

  // Check from the highest threshold down to the lowest
  if (balInBTC >= 0.01) {
    return <FaFaceSmileWink />;
  } else if (balInBTC >= 0.001) {
    return <FaFaceSmile />;
  } else if (balInBTC >= 0.0005) {
    return <FaFaceMeh />;
  } else if (balInBTC >= 0.0001) {
    return <FaFaceFrown />;
  } else if (balInBTC <= 0) {
    return <FaFaceSadCry />;
  } else {
    // For any case not covered above, though technically this branch might never be reached with the current logic
    return <FaFaceGrinStars />;
  }
};

const InnerMenu = ({ anchorEl, open, onClose }: any) => {
  const walletDetails = useWalletAddress();
  console.log({ walletDetails });
  if (walletDetails)
    return (
      <Popover
        anchorEl={anchorEl}
        onClose={onClose}
        open={open}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <div className="p-6 bg-primary-dark min-w-[300px] max-w-[400px] relative">
          <div className="intro flex items-center pb-6">
            <div className="mr-2 text-3xl">
              <Face balance={walletDetails.balance} />
            </div>
            <p className="uppercase font-bold text-sm">
              {shortenString(walletDetails.cardinal_address, 5)}
            </p>
          </div>
          <div className="BTCWallet flex items-center pb-6 w-full">
            <div className="mr-2">
              <img
                alt=""
                src="https://pngimg.com/uploads/bitcoin/bitcoin_PNG48.png"
                width={35}
              />{" "}
            </div>
            <div className="flex-1 flex justify-between items-center text-sm">
              <div>
                <p className="font-bold tracking-wider text-white">
                  BTC Wallet
                </p>
                <p className="uppercase">
                  {shortenString(walletDetails.cardinal_address, 5)}
                </p>
              </div>
              <div>
                <p className="font-bold tracking-wider text-white">
                  {(walletDetails.balance / 100_000_000).toFixed(3)} BTC
                </p>
                {/* <p className="uppercase font-bold text-sm">
                {shortenString(walletDetails.cardinal_address, 5)}
              </p> */}
              </div>
            </div>
          </div>
          <div className="OrdinalsWallet flex items-center pb-6 w-full">
            <div className="mr-2">
              <img
                alt=""
                src="https://pngimg.com/uploads/bitcoin/bitcoin_PNG48.png"
                width={35}
              />{" "}
            </div>
            <div className="flex-1 flex justify-between items-center text-sm">
              <div>
                <p className="font-bold tracking-wider text-white">
                  Ordinals Wallet
                </p>
                <p className="uppercase">
                  {shortenString(walletDetails.ordinal_address, 5)}
                </p>
              </div>
              <div>
                {/* <p className="font-bold tracking-wider text-white">
                  {(walletDetails.balance / 100_000_000).toFixed(3)} BTC
                </p> */}
                {/* <p className="uppercase font-bold text-sm">
                {shortenString(walletDetails.cardinal_address, 5)}
              </p> */}
              </div>
            </div>
          </div>
          <div className="relative ">
            <div className="bg-primary rounded cursor-pointer styled-button-wrapper my-2">
              <button className="accent_transition p-2 w-full">
                Dashboard
              </button>
            </div>
          </div>
          <div className="relative ">
            <div className="bg-primary rounded cursor-pointer styled-button-wrapper my-2">
              <button className="red_transition p-2 w-full">Disconnect</button>
            </div>
          </div>
          <div className="socials flex space-x-3 text-xl relative">
            <div className="relative ">
              <div className="bg-primary rounded cursor-pointer styled-button-wrapper">
                <button className="accent_transition p-2">
                  <FaXTwitter />
                </button>
              </div>
            </div>
            <div className="relative ">
              <button className="bg-primary rounded cursor-pointer  styled-button-wrapper">
                <button className="accent_transition p-2">
                  <FaDiscord />
                </button>
              </button>
            </div>
          </div>
        </div>
      </Popover>
    );
  else <></>;
};

function shortenString(str: string, length = 4): string {
  if (str.length <= 8) {
    return str;
  }
  const start = str.slice(0, length);
  const end = str.slice(-length);
  return `${start}...${end}`;
}
