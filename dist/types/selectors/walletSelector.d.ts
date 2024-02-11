export declare const walletAddressSelector: ((state: import("redux").EmptyObject & {
    notifications: import("../stores/reducers/notificationReducers").NotificationsState;
    general: import("../stores/reducers/generalReducer").GeneralState;
}) => {
    ordinal_address: string;
    cardinal_address: string;
    ordinal_pubkey: string;
    cardinal_pubkey: string;
    wallet: string | null;
    connected: boolean;
} | null) & import("reselect").OutputSelectorFields<(args_0: import("../types").WalletDetails | null) => {
    ordinal_address: string;
    cardinal_address: string;
    ordinal_pubkey: string;
    cardinal_pubkey: string;
    wallet: string | null;
    connected: boolean;
} | null, {
    clearCache: () => void;
}> & {
    clearCache: () => void;
};
