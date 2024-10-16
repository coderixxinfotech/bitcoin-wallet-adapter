# 🌟 Bitcoin Wallet Adapter

[![npm version](https://img.shields.io/npm/v/bitcoin-wallet-adapter.svg)](https://www.npmjs.com/package/bitcoin-wallet-adapter)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm downloads](https://img.shields.io/npm/dm/bitcoin-wallet-adapter.svg)](https://www.npmjs.com/package/bitcoin-wallet-adapter)
[![GitHub stars](https://img.shields.io/github/stars/coderixxinfotech/bitcoin-wallet-adapter.svg?style=social&label=Star)](https://github.com/coderixxinfotech/bitcoin-wallet-adapter)

A robust React-based solution for connecting and interacting with Bitcoin wallets. This package provides components and hooks for seamless integration within your React application. 🚀

## 🧙‍♂️ Tech Stack

- 🌐 Web: React
- 🔄 State Management: Redux
- 🦾 Language: TypeScript

## 🎯 Features

- 🔌 Easy-to-use React components for wallet connection and interactions
- 🔐 Support for multiple Bitcoin wallet providers
- 🎨 Customizable UI components
- 🪝 Hooks for common wallet operations (address fetching, transaction signing, message signing, BTC payments)
- 📘 TypeScript support

## 🚀 Installation

Install the package using npm or yarn:

```bash
npm install bitcoin-wallet-adapter

# or

yarn add bitcoin-wallet-adapter
```

## 🛠 Usage

### 🏛 WalletProvider

Wrap your application with the `WalletProvider` to enable wallet functionalities:

```jsx
import { WalletProvider } from "bitcoin-wallet-adapter";

function App() {
  return (
    <WalletProvider customAuthOptions={/* optional auth options */}>
      <YourApp />
    </WalletProvider>
  );
}
```

#### WalletProvider Props

| Prop              | Type                       | Description                                        |
| ----------------- | -------------------------- | -------------------------------------------------- |
| children          | ReactNode                  | The child components to be wrapped by the provider |
| customAuthOptions | AuthOptionsArgs (optional) | Custom authentication options                      |

The `AuthOptionsArgs` type includes:

```typescript
interface AuthOptionsArgs {
  manifestPath?: string;
  redirectTo?: string;
  network?: "mainnet" | "testnet";
  appDetails?: {
    name?: string;
    icon?: string;
  };
}
```

> 📝 Note: The `appDetails` field in `customAuthOptions` is primarily used by the Leather wallet.

### 🔗 ConnectMultiWallet

Use the `ConnectMultiWallet` component to render a multi-wallet connect button:

```jsx
import { ConnectMultiWallet } from "bitcoin-wallet-adapter";

function WalletConnect() {
  return (
    <ConnectMultiWallet
      buttonClassname="custom-button-class"
      modalContainerClass="custom-modal-container"
      modalContentClass="custom-modal-content"
      closeButtonClass="custom-close-button"
      headingClass="custom-heading"
      walletItemClass="custom-wallet-item"
      walletImageClass="custom-wallet-image"
      walletLabelClass="custom-wallet-label"
      InnerMenu={CustomInnerMenu}
      icon="custom-icon.png"
      iconClass="custom-icon-class"
      balance={1000}
      network="mainnet"
      connectionMessage="Custom connection message"
      fractal={true}
      supportedWallets={["unisat", "xverse", "leather"]}
    />
  );
}
```

#### ConnectMultiWallet Props

| Prop                | Type                                           | Description                                                  |
| ------------------- | ---------------------------------------------- | ------------------------------------------------------------ |
| buttonClassname     | string (optional)                              | Custom class for the main button                             |
| modalContainerClass | string (optional)                              | Custom class for the modal container                         |
| modalContentClass   | string (optional)                              | Custom class for the modal content                           |
| closeButtonClass    | string (optional)                              | Custom class for the close button                            |
| headingClass        | string (optional)                              | Custom class for the modal heading                           |
| walletItemClass     | string (optional)                              | Custom class for each wallet item in the list                |
| walletImageClass    | string (optional)                              | Custom class for wallet logos                                |
| walletLabelClass    | string (optional)                              | Custom class for wallet labels                               |
| InnerMenu           | React.ComponentType<InnerMenuProps> (optional) | Custom component for the inner menu when wallet is connected |
| icon                | string (optional)                              | Custom logo URL of your application                          |
| iconClass           | string (optional)                              | Custom class for the icon                                    |
| balance             | number (optional)                              | Wallet balance to display                                    |
| network             | "mainnet" \| "testnet" (optional)              | Bitcoin network to use                                       |
| connectionMessage   | string (optional)                              | Custom message for wallet connection                         |
| fractal             | boolean (optional)                             | Show only fractal supporting wallets (Unisat                 | OKX) |
| supportedWallets    | string[] (optional)                            | Array of wallet names to be supported in the dApp            |

The `supportedWallets` prop allows you to specify which wallets you want to support in your dApp. Pass an array of wallet names (in lowercase) to filter the available wallets. For example:

```jsx
supportedWallets={["unisat", "xverse", "leather"]}
```

This will only show the Unisat, Xverse, and Leather wallet options in the connect modal, even if other wallets are installed in the user's browser.

> 📝 Note: If `supportedWallets` is not provided, all available wallets will be shown.



### 🔔 Notification

Add the `Notification` component to your app to display wallet-related notifications:

```jsx
import { Notification } from "bitcoin-wallet-adapter";

function App() {
  return (
    <div>
      <YourAppContent />
      <Notification />
    </div>
  );
}
```

## 🪝 Hooks

### 📍 useWalletAddress

Fetch wallet addresses:

```jsx
import { useWalletAddress } from "bitcoin-wallet-adapter";

function WalletInfo() {
  const walletDetails = useWalletAddress();

  return (
    <div>
      <p>Ordinal Address: {walletDetails.ordinal}</p>
      <p>Cardinal Address: {walletDetails.cardinal}</p>
    </div>
  );
}
```

### ✍️ useSignTx

Sign PSBT (Partially Signed Bitcoin Transaction) for various operations:

```jsx
import { useSignTx } from "bitcoin-wallet-adapter";

function TransactionSigner() {
  const { signTx, loading, result, error } = useSignTx();

  const handleSellSign = async () => {
    const signOptions = {
      psbt: "your-psbt-base64",
      network: "mainnet",
      action: "sell",
      inputs: [
        {
          address: walletDetails.ordinal,
          publickey: walletDetails.ordinalPubkey,
          sighash: 131,
          index: [0],
        },
      ],
    };

    await signTx(signOptions);
  };

  // Use useEffect to handle the result or error
  useEffect(() => {
    if (result) {
      console.log("Sign Result:", result);
      // Handle successful signing
    }
    if (error) {
      console.error("Sign Error:", error);
      // Handle error
    }
  }, [result, error]);

  return (
    <button onClick={handleSellSign} disabled={loading}>
      {loading ? "Signing..." : "Sign Transaction"}
    </button>
  );
}
```

### 📝 useMessageSign

Sign messages for various wallets:

```jsx
import { useMessageSign } from "bitcoin-wallet-adapter";

function MessageSigner() {
  const { signMessage, loading, result, error } = useMessageSign();

  const handleMessageSign = async () => {
    const messageOptions = {
      network: "mainnet",
      address: walletDetails.ordinal,
      message: "Your message here",
      wallet: walletDetails.wallet,
    };

    await signMessage(messageOptions);
  };

  // Use useEffect to handle the result or error
  useEffect(() => {
    if (result) {
      console.log("Message Sign Result:", result);
      // Handle successful signing
    }
    if (error) {
      console.error("Message Sign Error:", error);
      // Handle error
    }
  }, [result, error]);

  return (
    <button onClick={handleMessageSign} disabled={loading}>
      {loading ? "Signing..." : "Sign Message"}
    </button>
  );
}
```

### 💸 usePayBTC

The `usePayBTC` hook facilitates BTC payments from the currently connected wallet:

```jsx
import { usePayBTC } from "bitcoin-wallet-adapter";

function BTCPayment() {
  const { payBTC, loading, result, error } = usePayBTC();

  const handlePayment = async () => {
    const paymentOptions = {
      network: "mainnet",
      address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
      amount: 1000, // Amount in satoshis
      fractal: false, // Optional: use fractal for OKX wallet
    };

    await payBTC(paymentOptions);
  };

  // Use useEffect to handle the result or error
  useEffect(() => {
    if (result) {
      console.log("Payment Result (txid):", result);
      // Handle successful payment
    }
    if (error) {
      console.error("Payment Error:", error);
      // Handle error
    }
  }, [result, error]);

  return (
    <button onClick={handlePayment} disabled={loading}>
      {loading ? "Processing Payment..." : "Pay BTC"}
    </button>
  );
}
```

#### PaymentOptions

The `payBTC` function accepts a `PaymentOptions` object with the following properties:

| Property | Type                   | Description                           |
| -------- | ---------------------- | ------------------------------------- |
| network  | "testnet" \| "mainnet" | The Bitcoin network to use            |
| address  | string                 | The recipient's Bitcoin address       |
| amount   | number                 | The amount to send in satoshis        |
| fractal  | boolean (optional)     | Whether to use fractal for OKX wallet |

#### Return Values

The `usePayBTC` hook returns an object with the following properties:

| Property | Type                                       | Description                                             |
| -------- | ------------------------------------------ | ------------------------------------------------------- |
| payBTC   | (options: PaymentOptions) => Promise<void> | Function to initiate the payment                        |
| loading  | boolean                                    | Indicates if a payment is in progress                   |
| result   | string \| null                             | The transaction ID (txid) if the payment was successful |
| error    | Error \| null                              | Any error that occurred during the payment process      |

#### Supported Wallets

The `usePayBTC` hook supports the following wallets:

- Leather
- Xverse
- MagicEden
- Unisat
- OKX
- Phantom (not implemented for BTC payments)

> 📝 Note: Make sure a wallet is connected before attempting to make a payment. The hook will return an error if no wallet is connected. The payment will be made using the currently connected wallet, which is determined by the `walletDetails` in the app's state.

This hook integrates with the notification system of the Bitcoin Wallet Adapter. Any errors during the payment process will be displayed as notifications in your application.

## 👛 Supported Wallets

Bitcoin Wallet Adapter currently supports the following wallets:

- 🦄 Unisat
- 🌌 Xverse
- 🐂 Leather/Hiro
- 🔮 MagicEden
- 👻 Phantom
- 🅾️ OKX

## 📚 Types

The package includes TypeScript definitions for key interfaces and types. Here are some of the main types used:

```typescript
interface WalletDetails {
  cardinal: string;
  cardinalPubkey: string;
  ordinal: string;
  ordinalPubkey: string;
  connected: boolean;
  wallet: string;
  derivationPath?: string;
}

type Purpose = "payment" | "ordinals";

type Account = {
  address: string;
  publicKey: string;
  purpose: Purpose;
};

interface UTXO {
  status: {
    block_hash: string;
    block_height: number;
    block_time: number;
    confirmed: boolean;
  };
  txid: string;
  value: number;
  vout: number;
  tx: any;
}

interface CommonSignOptions {
  psbt: string;
  network: "mainnet" | "testnet";
  action: "sell" | "buy" | "dummy" | "other";
  fractal?: boolean;
  inputs: {
    publickey: string;
    address: string;
    index: number[];
    sighash: number;
  }[];
}

interface CommonSignResponse {
  loading: boolean;
  result: any;
  error: Error | null;
  sign: (options: CommonSignOptions) => Promise<void>;
}
```

For a complete list of types, please refer to the `types.ts` file in the package.

## 🤝 Contributing

We welcome contributions to the Bitcoin Wallet Adapter! Please read our [CONTRIBUTING.md](./CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests. Let's build the future of Bitcoin wallets together! 🚀

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 🌐 Connect with Us

[![Discord](https://img.shields.io/badge/Discord-%237289DA.svg?logo=discord&logoColor=white)](https://discord.gg/UCgMuJ3uGx)
[![X](https://img.shields.io/badge/X-black.svg?logo=X&logoColor=white)](https://x.com/crypticmetadev)
[![Codepen](https://img.shields.io/badge/Codepen-000000?style=for-the-badge&logo=codepen&logoColor=white)](https://codepen.io/crypticmeta)

## 💻 Tech Stack

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Redux](https://img.shields.io/badge/redux-%23593d88.svg
