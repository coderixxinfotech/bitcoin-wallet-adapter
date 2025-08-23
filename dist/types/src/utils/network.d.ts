import { BitcoinNetworkType } from "sats-connect";
export type Network = "mainnet" | "testnet";
export declare const STORAGE_KEY_NETWORK = "bwa_network";
export declare function inferAddressNetwork(address?: string | null): Network | "unknown";
export declare function validateAddressesMatchNetwork(addresses: Array<string | undefined>, expected: Network): boolean;
export declare function toSatsConnectNetwork(n: Network): BitcoinNetworkType;
export declare function toLeatherNetwork(n: Network): "mainnet" | "testnet";
export declare function getOkxProvider(win: any, n: Network, opts?: {
    fractal?: boolean;
}): any;
