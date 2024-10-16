type PaymentOptions = {
    network: "testnet" | "mainnet";
    address: string;
    amount: number;
    fractal?: boolean;
};
export declare const usePayBTC: () => {
    payBTC: (options: PaymentOptions) => Promise<void>;
    loading: boolean;
    result: string | null;
    error: Error | null;
};
export {};
