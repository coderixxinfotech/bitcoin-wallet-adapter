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

  modalContainerClass = "bwa-bg-black bwa-bg-opacity-75 bwa-h-screen bwa-w-full bwa_center",
  modalContentClass = "bwa-bg-bwa_secondary bwa-p-6 bwa-min-w-[50%] bwa-relative bwa-shadow-xl bwa-rounded-xl",
  closeButtonClass = "bwa-rounded-full bwa-bg-gray-700 hover:bwa-bg-red-500 bwa-bg-opacity-50 bwa-text-gray-300 bwa-p-2 bwa-cursor-pointer",
  headingClass = "bwa_modalHeading bwa-text-bwa_accent",
  walletItemClass = "bwa-w-full md:bwa-w-5/12 bwa-cursor-pointer bwa-border bwa-border-transparent bwa-p-4 bwa-rounded-xl bwa-mb-4 bwa-transition-all hover:bwa-border-bwa_accent bwa-bg-opacity-50",
  walletImageClass = "bwa-w-[50px]",
  walletLabelClass = "bwa-text-white bwa-font-bold bwa-capitalize bwa-text-xl bwa-pl-3 bwa-text-center",
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
          <div className="bwa-absolute bwa-right-5 bwa-top-5">
            <div className={closeButtonClass} onClick={handleClose}>
              <RxCross1 />
            </div>
          </div>
          <p className={headingClass}>Connect your wallet</p>

          <div className="modalBody">
            <div className="bwa-flex bwa-flex-wrap bwa-items-center bwa-justify-around">
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
                  <div className="bwa_center bwa-p-3">
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
