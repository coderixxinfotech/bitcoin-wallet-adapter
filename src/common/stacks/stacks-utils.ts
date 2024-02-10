import { RPCClient } from "@stacks/rpc-client";
import { StacksMainnet, StacksTestnet } from "@stacks/network";

const testnetUrl = "https://stacks-node-api.testnet.stacks.co";
const localhostUrl = "http://localhost:3999";

export const getRPCClient = () => {
  return new RPCClient(testnetUrl);
};

// export const toRelativeTime = (ts: number): string => dayjs().to(ts);

export const stacksTestnetNetwork = new StacksTestnet({ url: testnetUrl });

export const stacksMainnetNetwork = new StacksMainnet();

export const stacksLocalhostNetwork = new StacksTestnet({ url: localhostUrl });
