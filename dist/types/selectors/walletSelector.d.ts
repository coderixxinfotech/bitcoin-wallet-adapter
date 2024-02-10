export declare const walletAddressSelector: ((state: import("redux").EmptyObject & {
    notifications: import("../stores/reducers/notificationReducers").NotificationsState;
    general: import("../stores/reducers/generalReducer").GeneralState;
}) => {
    ordinal_address: string;
    cardinal_address: string;
    ordinal_pubkey: string;
    cardinal_pubkey: string;
    balance: number;
    mempool_balance: number;
    dummy_utxos: number;
    wallet: string | null;
    connected: boolean;
} | null) & import("reselect").OutputSelectorFields<(args_0: import("../types").WalletDetails | null, args_1: number, args_2: number, args_3: number) => {
    ordinal_address: string;
    cardinal_address: string;
    ordinal_pubkey: string;
    cardinal_pubkey: string;
    balance: number;
    mempool_balance: number;
    dummy_utxos: number;
    wallet: string | null;
    connected: boolean;
} | null, {
    clearCache: () => void;
}> & {
    clearCache: () => void;
};
