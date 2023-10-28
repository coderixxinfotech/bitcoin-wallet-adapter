export interface WalletDetails {
  cardinal: string;
  cardinalPubkey: string;
  ordinal: string;
  ordinalPubkey: string;
  connected: boolean;
  derivationPath?: string;
}

export interface AuthOptionsArgs {
  manifestPath?: string;
  redirectTo?: string;
  appDetails?: {
    name?: string;
    icon?: string;
  };
}

export interface IInstalledWallets {
  label: string;
  logo: string;
}

export interface CommonSignOptions {
  psbt: string;
  network: "Mainnet" | "Testnet";
  action: "sell" | "buy" | "dummy" | "other";
  inputs: {
    publickey: string;
    address: string;
    index: number[];
    sighash: number;
  }[];
}

export interface CommonSignResponse {
  loading: boolean;
  result: any;
  error: Error | null;
  sign: (options: CommonSignOptions) => Promise<void>;
}
