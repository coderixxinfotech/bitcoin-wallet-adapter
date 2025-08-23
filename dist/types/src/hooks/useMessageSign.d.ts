export declare const useMessageSign: () => {
    signMessage: (options: {
        address: string;
        message: string;
        wallet: string;
        fractal?: boolean | undefined;
    }) => Promise<void>;
    loading: boolean;
    result: any;
    error: Error | null;
};
