"use strict";
// What happens in this file:
// - Network helpers for mapping and validation
// - Infer network from Bitcoin address
// - Map library network to provider-specific formats
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOkxProvider = exports.toLeatherNetwork = exports.toSatsConnectNetwork = exports.validateAddressesMatchNetwork = exports.inferAddressNetwork = exports.STORAGE_KEY_NETWORK = void 0;
const sats_connect_1 = require("sats-connect");
exports.STORAGE_KEY_NETWORK = "bwa_network";
function inferAddressNetwork(address) {
    if (!address)
        return "unknown";
    const a = address.trim().toLowerCase();
    // Bech32
    if (a.startsWith("bc1"))
        return "mainnet";
    if (a.startsWith("tb1") || a.startsWith("bcrt1"))
        return "testnet"; // include regtest as testnet-like
    // Legacy P2PKH / P2SH
    if (a.startsWith("1") || a.startsWith("3"))
        return "mainnet";
    if (a.startsWith("m") || a.startsWith("n") || a.startsWith("2"))
        return "testnet";
    return "unknown";
}
exports.inferAddressNetwork = inferAddressNetwork;
function validateAddressesMatchNetwork(addresses, expected) {
    const results = addresses
        .filter(Boolean)
        .map((a) => inferAddressNetwork(a));
    if (results.length === 0)
        return true;
    return results.every((n) => n === expected || n === "unknown");
}
exports.validateAddressesMatchNetwork = validateAddressesMatchNetwork;
function toSatsConnectNetwork(n) {
    return n === "testnet" ? sats_connect_1.BitcoinNetworkType.Testnet : sats_connect_1.BitcoinNetworkType.Mainnet;
}
exports.toSatsConnectNetwork = toSatsConnectNetwork;
function toLeatherNetwork(n) {
    return n;
}
exports.toLeatherNetwork = toLeatherNetwork;
function getOkxProvider(win, n, opts) {
    if (!(win === null || win === void 0 ? void 0 : win.okxwallet))
        return null;
    if (opts === null || opts === void 0 ? void 0 : opts.fractal)
        return win.okxwallet.fractalBitcoin;
    return n === "testnet" ? win.okxwallet.bitcoinTestnet : win.okxwallet.bitcoin;
}
exports.getOkxProvider = getOkxProvider;
