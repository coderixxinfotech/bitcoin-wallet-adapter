import React, { ReactNode } from "react";
import { AuthOptionsArgs } from "../types";
interface WalletProviderProps {
    children: ReactNode;
    customAuthOptions?: AuthOptionsArgs;
}
declare function WalletProvider({ children, customAuthOptions }: WalletProviderProps): React.JSX.Element;
export default WalletProvider;
