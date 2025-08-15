export interface SignMessageOptions {
    network: "testnet" | "mainnet";
    address: string;
    message: string;
    wallet: string;
    fractal?: boolean;
}
export interface SignTransactionOptions {
    network: "testnet" | "mainnet";
    address: string;
    recipient: string;
    amount: number;
    feeRate?: number;
    wallet: string;
    fractal?: boolean;
}
export interface UseWalletSigningReturn {
    isLoading: boolean;
    error: Error | null;
    lastSignature: string | null;
    signMessage: (options: SignMessageOptions) => Promise<string>;
    verifyMessage: (message: string, signature: string, address: string) => Promise<boolean>;
    signTransaction: (options: SignTransactionOptions) => Promise<string>;
    signPSBT: (psbtHex: string, options?: {
        broadcast?: boolean;
    }) => Promise<string>;
    clearSignature: () => void;
}
/**
 * Headless hook for wallet signing operations
 * Provides message signing, transaction signing, and PSBT operations without UI
 */
export declare const useWalletSigning: () => UseWalletSigningReturn;
