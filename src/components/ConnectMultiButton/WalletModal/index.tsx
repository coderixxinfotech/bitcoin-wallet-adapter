import React from "react";
import { Modal } from "@mui/material";
import { RxCross1 } from "react-icons/rx";
import { IInstalledWallets } from "../../../types";

interface WalletModalProps {
  open: boolean;
  handleClose: () => void;
  wallets: IInstalledWallets[];
  getLeatherAddress: () => void;
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

  icon?: string;
  iconClass?: string;
  iconContainerClass?: string;
}

const WalletModal: React.FC<WalletModalProps> = ({
  open,
  handleClose,
  wallets,
  getLeatherAddress,
  getAddress,
  getAddressOptions,
  getUnisatAddress,

  modalContainerClass = "bwa-bg-black bwa-bg-opacity-75 bwa-h-screen bwa-w-full bwa_center",
  modalContentClass = "bwa-bg-bwa_secondary bwa-p-6 bwa-min-w-[50%] bwa-relative bwa-shadow-xl bwa-rounded-xl",
  closeButtonClass = "bwa-rounded bwa_font-bold bwa-bg-gray-700 hover:bwa-bg-red-500 bwa-bg-opacity-50 bwa-text-gray-300 bwa-p-2 bwa-cursor-pointer",
  headingClass = "bwa_modalHeading bwa-text-bwa_accent",
  walletItemClass = "bwa-w-full bwa-cursor-pointer bwa-border bwa-border-transparent bwa-p-4 bwa-rounded-xl bwa-transition-all",
  walletImageClass = "bwa-w-[50px]",
  walletLabelClass = "bwa-text-white bwa-font-bold bwa-capitalize bwa-text-xl bwa-pl-3 bwa-text-center",

  icon = "https://ordinalnovus.com/logo_default.png",
  iconClass = "bwa-w-[100px]",
  iconContainerClass = "bwa-w-full bwa_center",
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
          <div className="bwa-w-full">
            <div className={iconContainerClass}>
              <img src={icon} className={iconClass} />
            </div>
          </div>
          <p className={headingClass}>Connect your wallet</p>
          {/* <hr className="bwa-w-5/12 bwa-bg-accent bwa-mb-8" /> */}

          <div className="modalBody">
            {wallets && wallets?.length > 0 ? (
              <div className="bwa-flex bwa-flex-wrap bwa-items-center bwa-justify-around">
                {wallets.map((item: IInstalledWallets, idx: number) => (
                  <div
                    onClick={async (e) => {
                      const selectedItem = item.label;
                      if (selectedItem === "Leather") {
                        await getLeatherAddress();
                      } else if (selectedItem === "Xverse") {
                        await getAddress(getAddressOptions);
                      } else if (selectedItem === "Unisat") {
                        await getUnisatAddress();
                      }
                    }}
                    key={item.label + idx}
                    className={walletItemClass}
                  >
                    <div className="bwa-flex bwa-justify-between bwa-items-center bwa-p-3">
                      <h5 className={walletLabelClass}>
                        {item.label + " wallet"}
                      </h5>
                      <div className="bwa_center">
                        <img
                          className={walletImageClass}
                          src={item.logo}
                          alt={`${item.label} logo`}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>
                No wallet Found. Try again after Installing Hiro / Xverse or
                Unisat wallet
              </p>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default WalletModal;
