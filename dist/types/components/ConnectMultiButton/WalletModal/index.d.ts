import React from "react";
import { IInstalledWallets } from "../../../types";
interface WalletModalProps {
    open: boolean;
    handleClose: () => void;
    wallets: IInstalledWallets[];
    getLeatherAddress: () => void;
    getPhantomAddress: () => void;
    getOkxAddress: () => void;
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
    meWallets: any;
    setWallet: any;
    icon?: string;
    iconClass?: string;
    iconContainerClass?: string;
}
declare const WalletModal: React.FC<WalletModalProps>;
export default WalletModal;
