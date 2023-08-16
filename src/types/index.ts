export interface WalletDetails {
  cardinal: string;
  cardinalPubkey: string;
  ordinal: string;
  ordinalPubkey: string;
  connected: boolean;
  derivationPath?: string;
}
export interface WalletState {
  walletDetails: WalletDetails | null;
  lastWallet: string;
}

export interface AuthOptionsArgs {
  manifestPath?: string;
  redirectTo?: string;
  appDetails?: {
    name?: string;
    icon?: string;
  };
}