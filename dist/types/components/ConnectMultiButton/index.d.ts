import React from "react";
interface InnerMenuProps {
    anchorEl: HTMLElement | null;
    open: boolean;
    onClose: () => void;
    disconnect: () => void;
}
type InnerMenuType = React.ComponentType<InnerMenuProps>;
declare function ConnectMultiWallet({ buttonClassname, modalContainerClass, modalContentClass, closeButtonClass, headingClass, walletItemClass, walletImageClass, walletLabelClass, InnerMenu, icon, iconClass, balance, network, connectionMessage, fractal, }: {
    buttonClassname?: string;
    modalContainerClass?: string;
    modalContentClass?: string;
    closeButtonClass?: string;
    headingClass?: string;
    walletItemClass?: string;
    walletImageClass?: string;
    walletLabelClass?: string;
    InnerMenu?: InnerMenuType;
    icon?: string;
    iconClass?: string;
    balance?: number;
    network?: "mainnet" | "testnet";
    connectionMessage?: string;
    fractal?: boolean;
}): React.JSX.Element;
export default ConnectMultiWallet;
