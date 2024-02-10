export declare const useWalletAddress: () => {
    ordinal_address: string;
    cardinal_address: string;
    ordinal_pubkey: string;
    cardinal_pubkey: string;
    balance: number;
    mempool_balance: number;
    dummy_utxos: number;
    wallet: string | null;
    connected: boolean;
} | null;
