# Bitcoin Wallet Adapter

A robust solution to connect and interact with Bitcoin wallets. The package provides components and hooks for easy integration within a React application.

## Installation

Use the package manager of your choice to install `bitcoin-wallet-adapter`.

```bash



npm  install  bitcoin-wallet-adapter



# or



yarn  add  bitcoin-wallet-adapter



```

## Components

### `WalletProvider`

A provider component that should be wrapped around your application to enable wallet functionalities.

#### Usage

```javascript
import { WalletProvider } from "bitcoin-wallet-adapter";

<WalletProvider
  customAuthOptions={{
    appDetails: { name: "My Example App" },
  }}
>
  <YourApp />
</WalletProvider>;
```

#### Props

`customAuthOptions (AuthOptionsArgs | optional)`

Configuration or set of options related to authentication. It's recommended you provide these.

`AuthOptionsArgs` Interface

- `redirectTo (string | optional)`: URL to which the user will be redirected after authentication.

- `appDetails (object | optional)`: Contains details about the app

- `name (string | optional)`: Name of the app

- `icon (string | optional)`: URL or path to the app's icon

### `ConnectMultiButton`

A component to render a multi-connect button for various wallet connections.

#### Usage

```javascript
import { ConnectMultiButton } from "bitcoin-wallet-adapter";

<ConnectMultiButton
  walletImageClass="w-[60px]"
  walletLabelClass="pl-3 font-bold text-xl"
  walletItemClass="border w-full md:w-6/12 cursor-pointer border-transparent rounded-xl mb-4 hover:border-green-500 transition-all"
  headingClass="text-green-700 text-4xl pb-12 font-bold text-center"
  buttonClassname="bg-green-300 hover:bg-green-400 rounded-xl flex items-center text-green-800 px-4 py-1 font-bold"
/>;
```

#### props

- `buttonClassname (string | Optional)`: Overrides style on button

- `headingClass (string | Optional)`: Overrides style on modal heading
- `walletItemClass (string | Optional)`: Overrides style on wallets div

- `walletImageClass (string | Optional)`: Overrides style on the wallet images
- `walletLabelClass (string | Optional)`: Overrides style on the wallet labels

### PayButton

A component to pay BTC from connected wallet to a given address

#### props

- `amount (number)`: Number of Sats to Transfer

- `receipent (string)`: BTC Address that will receive the sats
- `buttonClassname (string | Optional)`: Overrides button styling

#### Usage

```javascript
import { PayButton } from "bitcoin-wallet-adapter";

<PayButton
  amount={5000}
  receipent={"bc1qrwtu9ec4sl6txnxqhvgmuavm72gv32jsaz2mks"}
/>;
```

### `Notification`

A component to render notifications within the application.

#### Usage

```javascript
import { Notification } from "bitcoin-wallet-adapter";

<Notification />;
```

## Hooks

### `useWalletAddress`

A hook to fetch wallet addresses.

#### Usage

```javascript
import { useWalletAddress } from "bitcoin-wallet-adapter";

const walletDetails = useWalletAddress();
```

## Contributing

Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
