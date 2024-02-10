import React from "react";
import { IInstalledWallets, WalletDetails } from "../../../types";
interface InnerMenuProps {
    anchorEl: HTMLElement | null;
    open: boolean;
    onClose: () => void;
    disconnect: () => void;
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
    balance?: number | null;
}
declare const WalletButton: React.FC<WalletButtonProps>;
export default WalletButton;
