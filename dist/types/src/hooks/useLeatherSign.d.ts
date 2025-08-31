import { CommonSignResponse } from "../types";
type LeatherPsbtRequestOptions = {
    hex: string;
    signAtIndex?: number[];
    allowedSighash?: number[];
};
export declare const useLeatherSign: (defaultOptions?: Partial<LeatherPsbtRequestOptions>) => CommonSignResponse;
export {};
