export type Network = "mainnet" | "testnet";
export declare const useNetwork: (opts?: {
    persist?: boolean;
}) => {
    readonly network: "mainnet" | "testnet";
    readonly setNetwork: (n: Network) => void;
    readonly isTestnet: boolean;
    readonly toggle: () => void;
};
