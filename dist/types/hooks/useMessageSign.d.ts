export declare const useMessageSign: () => {
    signMessage: (options: {
        network: string;
        address: string;
        message: string;
        wallet: string;
        fractal?: boolean;
    }) => Promise<void>;
    loading: boolean;
    result: any;
    error: Error | null;
};
