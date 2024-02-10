import React, { ReactNode } from "react";
import { AuthOptionsArgs } from "../types";
interface WalletProviderProps {
    children: ReactNode;
    ord_url: string;
    customAuthOptions?: AuthOptionsArgs;
    mempoolUrl?: string;
    apikey?: string;
}
declare function WalletProvider({ children, customAuthOptions, mempoolUrl, ord_url, apikey, }: WalletProviderProps): React.JSX.Element;
export default WalletProvider;
