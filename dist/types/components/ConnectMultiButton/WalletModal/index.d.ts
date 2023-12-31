import React from "react";
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
declare const WalletModal: React.FC<WalletModalProps>;
export default WalletModal;
