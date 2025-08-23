"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stacksLocalhostNetwork = exports.stacksMainnetNetwork = exports.stacksTestnetNetwork = exports.getRPCClient = void 0;
const rpc_client_1 = require("@stacks/rpc-client");
const network_1 = require("@stacks/network");
const testnetUrl = "https://stacks-node-api.testnet.stacks.co";
const localhostUrl = "http://localhost:3999";
const getRPCClient = () => {
    return new rpc_client_1.RPCClient(testnetUrl);
};
exports.getRPCClient = getRPCClient;
// export const toRelativeTime = (ts: number): string => dayjs().to(ts);
exports.stacksTestnetNetwork = new network_1.StacksTestnet({ url: testnetUrl });
exports.stacksMainnetNetwork = new network_1.StacksMainnet();
exports.stacksLocalhostNetwork = new network_1.StacksTestnet({ url: localhostUrl });
