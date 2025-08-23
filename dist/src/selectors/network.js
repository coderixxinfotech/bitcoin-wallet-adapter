"use strict";
// This file exposes selectors for accessing network state from Redux.
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectIsTestnet = exports.selectNetwork = void 0;
const selectNetwork = (state) => state.general.network;
exports.selectNetwork = selectNetwork;
const selectIsTestnet = (state) => state.general.network === "testnet";
exports.selectIsTestnet = selectIsTestnet;
