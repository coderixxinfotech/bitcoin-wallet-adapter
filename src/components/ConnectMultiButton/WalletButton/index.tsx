import React from "react";
import CustomButton from "../../CustomButton";
import { IInstalledWallets, WalletDetails } from "../../../types";
import { shortenString } from "../../../utils";
import { RiAccountCircleFill } from "react-icons/ri";
import { FaWallet, FaPowerOff } from "react-icons/fa";
import { Menu, MenuItem, Divider } from "@mui/material";
interface WalletButtonProps {
  wallets: IInstalledWallets[];
  lastWallet: string;
  walletDetails: WalletDetails | null;
  handleMenuOpen: (event: React.MouseEvent<HTMLButtonElement>) => void;
  handleMenuClose: () => void;
  handleOpen: () => void;
  handleClose: () => void;
  disconnect: () => void;
  anchorEl: null | HTMLElement;
  menuOpen: boolean;
}

const WalletButton: React.FC<WalletButtonProps> = ({
  wallets,
  lastWallet,
  walletDetails,
  handleMenuOpen,
  handleMenuClose,
  handleOpen,
  handleClose,
  disconnect,
  anchorEl,
  menuOpen,
}) => {
  return lastWallet && walletDetails ? (
    <>
      <CustomButton
        icon={RiAccountCircleFill}
        text={`${shortenString(walletDetails.cardinal)}`}
        onClick={(e) => (menuOpen ? handleMenuClose() : handleMenuOpen(e))}
        hoverBgColor="hover:bg-bwa_accent_dark"
        hoverTextColor="text-white"
        bgColor="bg-bwa_accent"
        textColor="text-white"
        className="transition-all"
      />
      <Menu
        id="connected-menu"
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleMenuClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <Divider />
        <MenuItem onClick={disconnect}>
          <FaPowerOff />
          <p className="ml-2 text-xs">Disconnect</p>
        </MenuItem>
      </Menu>
    </>
  ) : (
    <CustomButton
      disabled={wallets?.length === 0 ? true : false}
      icon={FaWallet}
      text="Connect Wallet"
      onClick={handleOpen}
      hoverBgColor="hover:bg-bwa_accent_dark"
      hoverTextColor="text-white"
      bgColor="bg-bwa_accent"
      textColor="text-white"
      className="flex transition-all"
    />
  );
};

export default WalletButton;
