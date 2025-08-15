import { WalletDetails, IAvailableWallet } from "../types";
export interface UseWalletConnectReturn {
    isConnected: boolean;
    isLoading: boolean;
    error: Error | null;
    currentWallet: WalletDetails | null;
    lastWallet: string;
    availableWallets: IAvailableWallet[];
    meWallets: readonly any[];
    connect: (walletType: string, options?: any) => Promise<void>;
    disconnect: () => void;
    checkAvailableWallets: () => IAvailableWallet[];
    refreshBalance: () => Promise<void>;
}
/**
 * Headless hook for wallet connection and management
 * Provides all wallet connection logic without any UI components
 */
export declare const useWalletConnect: () => UseWalletConnectReturn;
