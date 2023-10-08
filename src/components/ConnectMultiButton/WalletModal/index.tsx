import React from "react";
import { Modal } from "@mui/material";
import { RxCross1 } from "react-icons/rx";
import { IInstalledWallets } from "../../../types";

interface WalletModalProps {
  open: boolean;
  handleClose: () => void;
  wallets: IInstalledWallets[];
  lastWallet: string;
  setWallet: (wallet: string) => void;
  doOpenAuth: () => void;
  getAddress: (options: any) => Promise<void>;
  getAddressOptions: any;
  getUnisatAddress: any;

  modalContainerClass?: string;
  modalContentClass?: string;
  closeButtonClass?: string;
  headingClass?: string;
  walletItemClass?: string;
  walletImageClass?: string;
  walletLabelClass?: string;
}

const WalletModal: React.FC<WalletModalProps> = ({
  open,
  handleClose,
  wallets,
  lastWallet,
  setWallet,
  doOpenAuth,
  getAddress,
  getAddressOptions,
  getUnisatAddress,

  modalContainerClass = "bg-black bg-opacity-75 h-screen w-full bwa_center",
  modalContentClass = "bg-bwa_secondary p-6 min-w-[50%] relative shadow-xl rounded-xl",
  closeButtonClass = "rounded-full bg-gray-700 hover:bg-red-500 bg-opacity-50 text-gray-300 p-2 cursor-pointer",
  headingClass = "bwa_modalHeading text-bwa_accent",
  walletItemClass = "w-full md:w-5/12 cursor-pointer border border-transparent p-4 rounded-xl mb-4 transition-all hover:border-bwa_accent bg-opacity-50",
  walletImageClass = "w-[50px]",
  walletLabelClass = "text-white font-bold capitalize text-xl pl-3 text-center",
}) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div className={modalContainerClass}>
        <div className={modalContentClass}>
          <div className="absolute right-5 top-5">
            <div className={closeButtonClass} onClick={handleClose}>
              <RxCross1 />
            </div>
          </div>
          <p className={headingClass}>Connect your wallet</p>

          <div className="modalBody">
            <div className="flex flex-wrap items-center justify-around">
              {wallets.map((item: IInstalledWallets, idx: number) => (
                <div
                  onClick={async (e) => {
                    const selectedItem = item.label;
                    if (selectedItem === "Leather") {
                      doOpenAuth();
                      setWallet(item.label);
                    } else if (selectedItem === "Xverse") {
                      await getAddress(getAddressOptions);
                    } else if (selectedItem === "Unisat") {
                      await getUnisatAddress();
                    }
                  }}
                  key={item.label + idx}
                  className={walletItemClass}
                >
                  <div className="bwa_center p-3">
                    <div className="bwa_center">
                      <img
                        className={walletImageClass}
                        src={item.logo}
                        alt={`${item.label} logo`}
                      />
                    </div>
                    <h5 className={walletLabelClass}>
                      {item.label + " wallet"}
                    </h5>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default WalletModal;
