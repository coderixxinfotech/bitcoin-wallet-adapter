import React from "react";
import {
  Modal,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import CustomButton from "../../CustomButton";

interface WalletModalProps {
  open: boolean;
  handleClose: () => void;
  wallets: string[];
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
        <div className="bg-secondary p-6 min-w-6/12  border xl:border-2 border-accent rounded-xl">
          <p className="modalHeading">Choose a wallet</p>
          <hr className="line" />
          {wallets?.includes("Hiro") && wallets?.includes("Xverse") && (
            <div>
              <p>
                It is recommended to use any one out of Hiro and Xverse wallets
              </p>
              <hr className="line" />
            </div>
          )}
          <div className="modalBody">
            <FormControl>
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
                {wallets.map((item, idx) => (
                  <FormControlLabel
                    key={item + idx}
                    value={item}
                    control={<Radio />}
                    color="inherit"
                    label={item + " wallet"}
                    checked={lastWallet === item}
                  />
                ))}
              </RadioGroup>
            </FormControl>
            <div className="mt-4">
              <CustomButton
                text="Cancel"
                onClick={handleClose}
                hoverBgColor="hover:bg-red-900"
                hoverTextColor="text-white"
                bgColor="bg-red-800"
                textColor="text-white"
                className="flex transition-all"
              />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default WalletModal;
