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

If your project has an extra Redux provider make sure it acts as a wrapper for this provider

```javascript
import { WalletProvider } from "bitcoin-wallet-adapter";

<WalletProvider>
  <YourApp />
</WalletProvider>;
```

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
  InnerMenu={InnerMenu} // component to show a menu when wallet is connected
  icon=""
  iconClass=""
  balance={1000} // comment it if you dont know the wallet balance
/>;
```

#### props

- `buttonClassname (string | Optional)`: Overrides style on button
- `headingClass (string | Optional)`: Overrides style on modal heading
- `walletItemClass (string | Optional)`: Overrides style on wallets div
- `walletImageClass (string | Optional)`: Overrides style on the wallet images
- `walletLabelClass (string | Optional)`: Overrides style on the wallet labels
- `InnerMenu (React Component | Optional)`: Overrides default menu when wallet is connected
- `icon (string | Optional)`: Overrides default image in modal
- `iconClass (string | Optional)`: Overrides default image in modal classname
- `balance (number | Optional)`: shows the balance innstead of wallet address when wallet is connected

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

### `useSignTx`

A hook to facilitate the PSBT signing process for various wallets (Unisat, Xverse and Leather/Hiro).

#### Usage

##### Sell Psbt Sign

```javascript
import { useSignTx } from "bitcoin-wallet-adapter";

const MyComponent = () => {
  const { signTx, loading, result, error } = useSignTx();

  const handleSellSign = async () => {
    const signOptions = {
      psbt: yourPsbtBase64,
      network: "Mainnet",
      action: "sell",
      inputs: [
        {
          address: walletDetails.ordinal_address,
          publickey: walletDetails.ordinal_pubkey,
          sighash: 131,
          index: [0],
        },
      ],
    };

    await signTx(signOptions);
  };
};
```

##### Dummy Psbt Sign

```javascript


const  handleDummySign = async () => {

	const  signOptions = {
		psbt:  yourPsbtBase64,
		network:  "Mainnet",
		action:  "dummy",
		inputs: [
					{
					address:  walletDetails.cardinal_address,
					publickey:  walletDetails.cardinal_pubkey,
					sighash:  1,
					index: [0],
					},
				]
		};

	  await  signTx(signOptions);

	};
};

```

##### Buy Psbt Sign

```javascript

const  handleBuySign = async () => {
	const inputs = [];

	new  Array(inputLength).fill(1).map((item:  number, idx:  number) => {
	if (idx  !==  2)
		inputs.push({
		address:  walletDetails.cardinal_address,
		publickey:  walletDetails.cardinal_pubkey,
		sighash:  1,
		index: [idx],
		});

	});

	const  signOptions = {
		psbt:  yourPsbtBase64,
		network:  "Mainnet",
		action:  "buy",
		inputs
		};
	  await  signTx(signOptions);

	};
};
```

##### Usage of Result/Error Listener

```
useEffect(() => {
	// Handling Wallet Sign Results/Errors
	if (result) {
		// Handle successful result from wallet sign
		console.log("Sign Result:", result);
		if (result) {
			listOrdinal(result);
		}
	}



	if (error) {
		// Handle error from wallet sign
		console.error(" Sign Error:", error);
		// Turn off loading after handling results or errors
		setLoading(false);
		alert(error.message  ||  "wallet error occurred");
	}

}, [result, error]);
```

### `useMessageSign`

A hook to facilitate the message signing process for various wallets (Magiceden, Unisat, Xverse and Leather/Hiro).

#### Usage

##### Sell Psbt Sign

```javascript
import { useMessageSign } from "bitcoin-wallet-adapter";

const MyComponent = () => {
  const { signMessage, loading, result, error } = useMessageSign();

  const handleMessageSign = async () => {
    const messageOptions = {
      network: "mainnet",
      address: walletDetails.ordinal_address,
      message: "Any Message Here",
      wallet: walletDetails.wallet,
    };

    await signMessage(messageOptions);
  };
};
```

##### Usage of Result / Error Listener

```
useEffect(() => {
	// Handling Wallet Sign Results/Errors
	if (result) {
		// Handle successful result from wallet sign
		console.log("Message Sign Result:", result);
		if (result) {
			delistOrdinal(result);
		}
	}



	if (error) {
		// Handle error from wallet sign
		console.error(" Sign Error:", error);
		// Turn off loading after handling results or errors
		setLoading(false);
		alert(error.message  ||  "wallet error occurred");
	}

}, [result, error]);
```

## Contributing

Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
