export declare const useWalletAddress: () => {
    ordinal_address: string;
    cardinal_address: string;
    ordinal_pubkey: string;
    cardinal_pubkey: string;
    balance: number | null;
    mempool_balance: number | null;
    dummy_utxos: number | null;
    wallet: string | null;
    connected: boolean;
} | null;
