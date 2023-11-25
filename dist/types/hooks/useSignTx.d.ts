import { CommonSignOptions } from "../types/index";
export declare const useSignTx: () => {
    signTx: (props: CommonSignOptions) => Promise<void>;
    loading: boolean;
    result: null;
    error: any;
};
