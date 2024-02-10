export declare function convertSatToBtc(priceInSat: number): number;
export declare function convertBtcToSat(priceInSat: number): number;
export declare function base64ToHex(str: string): string;
export declare function getBTCPriceInDollars(): Promise<any>;
export declare function shortenString(str: string, length?: number): string;
export declare const hexToBase64: (hexString: string) => string;
export declare const isHex: (str: string) => boolean;
export declare const isBase64: (str: string) => boolean;
export declare function countDummyUtxos(address: string, mempool_url: string, ord_url: string): Promise<number>;
