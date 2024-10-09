interface WalletDetails {
    wallet: string;
}
declare const useWalletEffect: (walletDetails: WalletDetails | null, disconnect: () => void, network?: string, redux_network?: string) => void;
export default useWalletEffect;
