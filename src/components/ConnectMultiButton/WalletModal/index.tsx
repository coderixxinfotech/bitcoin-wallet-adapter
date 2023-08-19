import React from "react";
import {
  Modal,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { RxCross1 } from "react-icons/rx";
import { IInstalledWallets } from "../../../types";

interface WalletModalProps {
  open: boolean;
  handleClose: () => void;
  wallets: IInstalledWallets[];
  lastWallet: string;
  setWallet: (event: React.ChangeEvent<HTMLInputElement>) => void;
  doOpenAuth: () => void;
  getAddress: (options: any) => Promise<void>;
  getAddressOptions: any;
  getUnisatAddress: any;
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
}) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div className="bg-black bg-opacity-75 h-screen w-full center">
        <div className="bg-secondary p-6 min-w-6/12 lg:min-w-auto relative border xl:border-4 border-accent rounded-xl">
          <div className="absolute right-5 top-5">
            <div
              className="rounded-full bg-gray-700 hover:bg-red-500 bg-opacity-50 text-gray-300 p-2 cursor-pointer"
              onClick={handleClose}
            >
              <RxCross1 />
            </div>
          </div>
          <p className="modalHeading">Connect a wallet to continue</p>
          {wallets.length > 0 &&
            wallets.some((wallet: IInstalledWallets) =>
              wallet.label.includes("Hiro")
            ) &&
            wallets.some((wallet: IInstalledWallets) =>
              wallet.label.includes("Xverse")
            ) && (
              <div>
                <hr className="line" />
                <p className="text-xs">
                  It is recommended to use any one out of Hiro and Xverse
                  wallets
                </p>
                <hr className="line" />
              </div>
            )}

          <div className="modalBody">
            <FormControl fullWidth>
              <RadioGroup
                
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="controlled-radio-buttons-group"
                value={lastWallet}
                onChange={async (e) => {
                  const item = e.target.value;
                  if (item === "Hiro") {
                    doOpenAuth();
                    setWallet(e);
                  } else if (item === "Xverse") {
                    await getAddress(getAddressOptions);
                  } else if (item === "Unisat") {
                    await getUnisatAddress();
                  }
                }}
              >
                {wallets.map((item: IInstalledWallets, idx: number) => (
                  <div key={item.label + idx} className="w-full flex justify-between items-center">
                    <div className="flex items-center ">
                      <img src={item.logo}  />{" "}
                      <span>{item.label + " wallet"}</span>{" "}
                      {/* Name rendering */}
                    </div>
                    <FormControlLabel
                      label=""
                      value={item.label}
                      control={<Radio />}
                      color="inherit"
                      labelPlacement="end" // Position the label after the control (optional)
                      checked={lastWallet === item.label}
                    />
                  </div>
                ))}
              </RadioGroup>
            </FormControl>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default WalletModal;
