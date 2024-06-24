export declare const useMessageSign: () => {
    signMessage: (options: {
        network: string;
        address: string;
        message: string;
        wallet: string;
    }) => Promise<void>;
    loading: boolean;
    result: any;
    error: Error | null;
};
