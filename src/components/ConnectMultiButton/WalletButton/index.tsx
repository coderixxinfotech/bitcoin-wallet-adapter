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
  classname?: string;
  additionalMenuItems?: React.ReactNode[];
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
  classname,
  additionalMenuItems,
}) => {
  return lastWallet && walletDetails ? (
    <>
      <CustomButton
        icon={RiAccountCircleFill}
        text={`${shortenString(walletDetails.cardinal, 5)}`}
        onClick={(e) => (menuOpen ? handleMenuClose() : handleMenuOpen(e))}
        className={classname}
      />
      <Menu
        id="connected-menu"
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleMenuClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {additionalMenuItems?.map((Item, index) => (
          <>
            <MenuItem key={index}>{Item}</MenuItem>
            <Divider />
          </>
        ))}
        <MenuItem onClick={disconnect} className="bwa-flex">
          <FaPowerOff />
          <p className="bwa-ml-2 bwa-text-xs">Disconnect</p>
        </MenuItem>
      </Menu>
    </>
  ) : (
    <CustomButton
      disabled={wallets?.length === 0 ? true : false}
      icon={FaWallet}
      text="Connect Wallet"
      onClick={handleOpen}
      className={classname}
    />
  );
};

export default WalletButton;
