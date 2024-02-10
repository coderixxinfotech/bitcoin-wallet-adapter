import React from "react";
import CustomButton from "../../CustomButton";
import { IInstalledWallets, WalletDetails } from "../../../types";
import { shortenString } from "../../../utils";
import { RiAccountCircleFill } from "react-icons/ri";
import { FaWallet, FaPowerOff } from "react-icons/fa";
import {
  FaFaceFrown,
  FaFaceGrinStars,
  FaFaceMeh,
  FaFaceSadCry,
  FaFaceSmile,
  FaFaceSmileBeam,
  FaFaceSmileWink,
} from "react-icons/fa6";
import { Menu, MenuItem, Popover } from "@mui/material";
interface InnerMenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
}

type InnerMenuType = React.ComponentType<InnerMenuProps>;

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
  InnerMenu?: InnerMenuType;
  balance?: number;
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
  InnerMenu,
  balance,
}) => {
  return lastWallet && walletDetails ? (
    <div className="relative">
      <CustomButton
        icon={RiAccountCircleFill}
        text={`${
          balance
            ? `${(balance / 100_000_000).toFixed(3)} BTC`
            : shortenString(walletDetails.cardinal, 5)
        }`}
        onClick={(e) => (menuOpen ? handleMenuClose() : handleMenuOpen(e))}
        className={classname}
      />

      {InnerMenu ? (
        <InnerMenu
          anchorEl={anchorEl}
          open={menuOpen}
          onClose={handleMenuClose}
        />
      ) : (
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
          <div>
            <MenuItem onClick={disconnect} className="bwa-flex">
              <FaPowerOff />
              <p className="bwa-ml-2 bwa-text-xs">Disconnect</p>
            </MenuItem>
          </div>
        </Menu>
      )}
    </div>
  ) : (
    <CustomButton
      // disabled={wallets?.length === 0 ? true : false}
      icon={FaWallet}
      text="Connect Wallet"
      onClick={handleOpen}
      className={classname}
    />
  );
};

export default WalletButton;
