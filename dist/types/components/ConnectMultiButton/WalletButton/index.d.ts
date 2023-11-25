import React from "react";
import { IInstalledWallets, WalletDetails } from "../../../types";
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
declare const WalletButton: React.FC<WalletButtonProps>;
export default WalletButton;
