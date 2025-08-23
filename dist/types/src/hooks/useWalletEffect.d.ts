interface WalletDetails {
    wallet: string;
}
declare const useWalletEffect: (walletDetails: WalletDetails | null, disconnect: () => void, redux_network?: string) => void;
export default useWalletEffect;
