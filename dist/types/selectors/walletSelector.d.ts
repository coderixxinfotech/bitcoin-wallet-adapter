export declare const walletAddressSelector: ((state: import("redux").EmptyObject & {
    notifications: import("../stores/reducers/notificationReducers").NotificationsState;
    general: import("../stores/reducers/generalReducer").GeneralState;
}) => {
    ordinal_address: string;
    cardinal_address: string;
    ordinal_pubkey: string;
    cardinal_pubkey: string;
    balance: number | null;
    mempool_balance: number | null;
    dummy_utxos: number | null;
    wallet: string | null;
    connected: boolean;
} | null) & import("reselect").OutputSelectorFields<(args_0: import("../types").WalletDetails | null, args_1: number | null, args_2: number | null, args_3: number | null) => {
    ordinal_address: string;
    cardinal_address: string;
    ordinal_pubkey: string;
    cardinal_pubkey: string;
    balance: number | null;
    mempool_balance: number | null;
    dummy_utxos: number | null;
    wallet: string | null;
    connected: boolean;
} | null, {
    clearCache: () => void;
}> & {
    clearCache: () => void;
};
