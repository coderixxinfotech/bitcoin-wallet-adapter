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

<WalletProvider>
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

<ConnectMultiButton />;
```

### PayButton

A component to pay BTC from connected wallet to a given address

#### props

- `amount (number)`: Number of Sats to Transfer
- `receipent (string)`: BTC Address that will receive the sats

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

## Styling

The package relies on Tailwind CSS for styling. Ensure that you've included Tailwind CSS in your project.

```javascript
import "tailwindcss/tailwind.css";
```

## Contributing

Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
