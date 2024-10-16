export declare const usePayBTC: () => {
    payBTC: (options: {
        network: string;
        address: string;
        amount: number;
        wallet: string;
        fractal?: boolean | undefined;
    }) => Promise<void>;
    loading: boolean;
    result: any;
    error: Error | null;
};
