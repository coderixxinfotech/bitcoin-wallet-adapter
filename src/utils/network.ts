// What happens in this file:
// - Network helpers for mapping and validation
// - Infer network from Bitcoin address
// - Map library network to provider-specific formats

import { BitcoinNetworkType } from "sats-connect";

export type Network = "mainnet" | "testnet";

export const STORAGE_KEY_NETWORK = "bwa_network";

export function inferAddressNetwork(address?: string | null): Network | "unknown" {
  if (!address) return "unknown";
  const a = address.trim().toLowerCase();
  // Bech32
  if (a.startsWith("bc1")) return "mainnet";
  if (a.startsWith("tb1") || a.startsWith("bcrt1")) return "testnet"; // include regtest as testnet-like
  // Legacy P2PKH / P2SH
  if (a.startsWith("1") || a.startsWith("3")) return "mainnet";
  if (a.startsWith("m") || a.startsWith("n") || a.startsWith("2")) return "testnet";
  return "unknown";
}

export function validateAddressesMatchNetwork(addresses: Array<string | undefined>, expected: Network): boolean {
  const results = addresses
    .filter(Boolean)
    .map((a) => inferAddressNetwork(a as string));
  if (results.length === 0) return true;
  return results.every((n) => n === expected || n === "unknown");
}

export function toSatsConnectNetwork(n: Network): BitcoinNetworkType {
  return n === "testnet" ? BitcoinNetworkType.Testnet : BitcoinNetworkType.Mainnet;
}

export function toLeatherNetwork(n: Network): "mainnet" | "testnet" {
  return n;
}

export function getOkxProvider(win: any, n: Network, opts?: { fractal?: boolean }) {
  if (!win?.okxwallet) return null;
  if (opts?.fractal) return win.okxwallet.fractalBitcoin;
  return n === "testnet" ? win.okxwallet.bitcoinTestnet : win.okxwallet.bitcoin;
}
