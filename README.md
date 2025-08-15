# 🌟 Bitcoin Wallet Adapter

[![npm version](https://img.shields.io/npm/v/bitcoin-wallet-adapter.svg)](https://www.npmjs.com/package/bitcoin-wallet-adapter)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm downloads](https://img.shields.io/npm/dm/bitcoin-wallet-adapter.svg)](https://www.npmjs.com/package/bitcoin-wallet-adapter)
[![GitHub stars](https://img.shields.io/github/stars/coderixxinfotech/bitcoin-wallet-adapter.svg?style=social&label=Star)](https://github.com/coderixxinfotech/bitcoin-wallet-adapter)

A **production-ready** React library for Bitcoin wallet integration with professional UI/UX, comprehensive error handling, and support for **6+ popular Bitcoin wallets**. Built with TypeScript, Redux, and modern React patterns. 🚀

## ✨ Latest Features

- 🎨 **Professional UI/UX** - High-contrast, accessible design with Tailwind CSS
- ⚡ **Real-time Balance Tracking** - Pending transaction awareness and accurate balance display  
- 💸 **BTC Payment Integration** - Built-in `usePayBTC` hook with transaction ID capture
- 🔒 **Professional Error Handling** - Comprehensive error management with detailed feedback
- 📱 **6+ Wallet Support** - Unisat, Xverse, Leather, MagicEden, Phantom, OKX
- 🌐 **Mainnet Ready** - Optimized for production Bitcoin mainnet usage

## 🧙‍♂️ Tech Stack

- ⚛️ **Frontend**: React 18, TypeScript, Material-UI
- 🔄 **State Management**: Redux Toolkit with RTK Query
- 🎨 **Styling**: Tailwind CSS, CSS-in-JS support
- 🔐 **Security**: Network isolation, error boundaries, input validation
- 📦 **Build**: Modern bundling with tree-shaking support

## 🚀 Quick Start

### Installation

```bash
npm install bitcoin-wallet-adapter
# or
yarn add bitcoin-wallet-adapter
# or
pnpm add bitcoin-wallet-adapter
```

### Complete Working Example

Here's a **complete, production-ready implementation** you can copy and use immediately:

```typescript
import React, { useState } from 'react';
import {
  WalletProvider,
  ConnectMultiButton,
  useWalletAddress,
  useWalletBalance,
  usePayBTC,
  useMessageSign,
  Notification
} from 'bitcoin-wallet-adapter';

// 🎯 Main App Component
function App() {
  return (
    <WalletProvider
      customAuthOptions={{
        network: "mainnet", // Production ready
        appDetails: {
          name: "My Bitcoin App",
          icon: "/logo.png"
        }
      }}
    >
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">
            🌟 My Bitcoin Wallet App
          </h1>
          
          {/* 🔌 Connect Button - Always visible for persistence */}
          <ConnectMultiButton
            network="mainnet"
            buttonClassname="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg transition-all"
            modalContainerClass="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            modalContentClass="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6"
            supportedWallets={["unisat", "xverse", "leather", "magiceden", "phantom", "okx"]}
          />
        </header>
        
        {/* 📊 Wallet Dashboard */}
        <WalletDashboard />
        
        {/* 💸 Payment Interface */}
        <PaymentInterface />
        
        {/* 🔔 Notifications */}
        <Notification />
      </div>
    </WalletProvider>
  );
}

// 📊 Wallet Dashboard Component  
function WalletDashboard() {
  const walletDetails = useWalletAddress();
  const { balance, btcPrice, refreshBalance, loading } = useWalletBalance();
  
  if (!walletDetails.cardinal) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">🔐</div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            Wallet Not Connected
          </h2>
          <p className="text-slate-600">
            Connect your Bitcoin wallet to see your balance and start transacting.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto mb-8">
      <div className="grid md:grid-cols-2 gap-6">
        {/* 💰 Balance Card */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-slate-800">💰 Balance</h3>
            <button
              onClick={refreshBalance}
              disabled={loading}
              className="text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50"
            >
              {loading ? '⏳' : '🔄'} Refresh
            </button>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Confirmed:</span>
              <span className="font-bold text-2xl text-emerald-600">
                {(balance?.confirmed || 0).toFixed(8)} BTC
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-slate-600">USD Value:</span>
              <span className="font-semibold text-slate-800">
                ${((balance?.confirmed || 0) * btcPrice).toFixed(2)}
              </span>
            </div>
            
            {(balance?.unconfirmed || 0) > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Pending:</span>
                <span className="font-medium text-orange-600">
                  {balance.unconfirmed.toFixed(8)} BTC
                </span>
              </div>
            )}
          </div>
        </div>
        
        {/* 🔗 Wallet Info Card */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-slate-800 mb-4">🔗 Wallet Info</h3>
          
          <div className="space-y-3">
            <div>
              <span className="text-slate-600 text-sm">Connected Wallet:</span>
              <p className="font-bold text-lg text-blue-600">
                {walletDetails.wallet || 'Unknown'}
              </p>
            </div>
            
            <div>
              <span className="text-slate-600 text-sm">Cardinal Address:</span>
              <p className="font-mono text-sm bg-slate-100 p-2 rounded truncate">
                {walletDetails.cardinal}
              </p>
            </div>
            
            {walletDetails.ordinal && (
              <div>
                <span className="text-slate-600 text-sm">Ordinal Address:</span>
                <p className="font-mono text-sm bg-slate-100 p-2 rounded truncate">
                  {walletDetails.ordinal}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// 💸 Payment Interface Component
function PaymentInterface() {
  const walletDetails = useWalletAddress();
  const { payBTC, loading, error } = usePayBTC();
  const [recipient, setRecipient] = useState(
    localStorage.getItem('btc-recipient') || ''
  );
  const [amount, setAmount] = useState(1000); // satoshis
  const [lastTxId, setLastTxId] = useState<string | null>(null);
  
  if (!walletDetails.cardinal) return null;
  
  const handlePayment = async () => {
    try {
      const result = await payBTC({
        address: recipient,
        amount: amount,
        network: 'mainnet'
      });
      
      // Handle both string (txId) and object responses
      const txId = typeof result === 'string' ? result : result.txid || result.transactionId;
      setLastTxId(txId);
      
      // Save recipient for next time
      localStorage.setItem('btc-recipient', recipient);
      
      alert(`✅ Payment sent! Transaction ID: ${txId}`);
    } catch (err: any) {
      console.error('Payment failed:', err);
      alert(`❌ Payment failed: ${err.message}`);
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-slate-800 mb-6">💸 Send Bitcoin</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-slate-700 font-medium mb-2">
              Recipient Address:
            </label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-slate-700 font-medium mb-2">
              Amount (satoshis):
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
              min="546"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-sm text-slate-500 mt-1">
              ≈ {(amount / 100000000).toFixed(8)} BTC
            </p>
          </div>
          
          <button
            onClick={handlePayment}
            disabled={loading || !recipient || amount < 546}
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white py-3 rounded-lg font-semibold transition-colors"
          >
            {loading ? '⏳ Processing...' : '💸 Send Bitcoin'}
          </button>
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 font-medium">❌ Error: {error.message}</p>
            </div>
          )}
          
          {lastTxId && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
              <p className="text-emerald-800 font-medium">✅ Transaction sent!</p>
              <p className="text-sm text-emerald-600 font-mono break-all">
                {lastTxId}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
```

### 🎯 Key Implementation Features

- **🔌 Persistent Connection**: ConnectMultiButton stays visible for wallet persistence after page refresh
- **⚡ Real-time Balance**: Automatic balance updates with pending transaction awareness  
- **💸 Payment Integration**: Complete BTC payment flow with transaction ID capture
- **💾 Local Storage**: Remembers recipient addresses between sessions
- **🎨 Professional UI**: High-contrast, accessible design with Tailwind CSS
- **🔒 Error Handling**: Comprehensive error management with user-friendly messages
- **📱 Multi-wallet Support**: Works with Unisat, Xverse, Leather, MagicEden, Phantom, OKX

### 📋 Latest Project Status (v1.8.2)

#### ✅ **Completed Enhancements**
- **Demo Application Excellence**: Professional UI/UX redesign with high-contrast accessibility
- **Payment System**: Full BTC payment integration with transaction ID capture and pending balance awareness
- **Error Handling**: Comprehensive error management with user-friendly feedback across all wallet operations
- **Architecture Documentation**: Complete technical analysis and network switching constraint documentation
- **Multi-wallet Support**: Production-ready support for 6+ major Bitcoin wallets
- **Mainnet Optimization**: Optimized for production Bitcoin mainnet usage with proper network isolation

#### 🔍 **Architectural Insights**
- **Network Management**: Uses internal Redux state for network management; external apps cannot dynamically switch networks without library modifications
- **Hook Design**: All hooks (`useWalletBalance`, `usePayBTC`, `useMessageSign`) read from internal Redux state, not parameters
- **Module Boundaries**: Example apps are limited to initialization-time network selection via `ConnectMultiButton`
- **Security**: Proper network isolation prevents cross-network transaction issues

#### 🚀 **Production Ready Features**
- **Professional Error System**: BWAError class with severity levels and detailed error tracking
- **Real-time Balance**: Accurate balance display with pending transaction awareness
- **Transaction Management**: Complete payment flow with proper transaction ID handling
- **Persistent Sessions**: Wallet connections persist across page refreshes
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS integration

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

## 🪝 API Reference

### Core Hooks

```jsx
import { 
  useWalletAddress,    // Get wallet connection details
  useWalletBalance,    // Get balance and BTC price  
  useMessageSign,      // Sign messages
  usePayBTC           // Send Bitcoin payments
} from "bitcoin-wallet-adapter";

// Get wallet info
const walletDetails = useWalletAddress();
console.log(walletDetails.cardinal); // Payment address
console.log(walletDetails.wallet);   // Wallet name

// Get balance
const { balance, btcPrice } = useWalletBalance();
console.log(balance.confirmed); // Confirmed BTC

// Sign message
const { signMessage } = useMessageSign();
const signature = await signMessage({
  message: "Hello Bitcoin!",
  address: walletDetails.cardinal,
  network: "mainnet",
  wallet: walletDetails.wallet
});

// Send payment
const { payBTC } = usePayBTC();
const txId = await payBTC({
  address: "bc1q...",
  amount: 1000, // satoshis
  network: "mainnet"
});
```

## 🚨 Professional Error Handling System

Bitcoin Wallet Adapter features a comprehensive, professional-grade error handling system that provides consistent error management, automatic notifications, and detailed error tracking across all wallet operations.

### 🔧 Core Error Handling Components

#### **BWAError Class**
Custom error class with professional error codes, severity levels, and contextual information:

```typescript
import { throwBWAError, BWAErrorCode, BWAErrorSeverity } from 'bitcoin-wallet-adapter';

// Professional error with all context
throwBWAError(
  BWAErrorCode.WALLET_NOT_CONNECTED,
  "No wallet is currently connected. Please connect a wallet first.",
  {
    severity: BWAErrorSeverity.HIGH,
    context: {
      operation: 'message_signing',
      additionalData: { expectedWallet: 'Unisat' }
    }
  }
);
```

#### **Error Codes & Severity Levels**

**Error Codes:**
- `WALLET_NOT_CONNECTED` - No wallet connected
- `WALLET_NOT_SUPPORTED` - Unsupported wallet type  
- `TRANSACTION_SIGNING_FAILED` - Transaction signing errors
- `MESSAGE_SIGNING_FAILED` - Message signing errors
- `SIGNATURE_VERIFICATION_FAILED` - Signature verification errors
- `PSBT_INVALID` - Invalid PSBT format
- `NETWORK_MISMATCH` - Network configuration mismatch
- `VALIDATION_ERROR` - Input validation errors
- `CONNECTION_FAILED` - Wallet connection failures
- `INSUFFICIENT_BALANCE` - Insufficient wallet balance
- `USER_REJECTED` - User canceled operation

**Severity Levels:**
- `LOW` - Minor issues, recoverable
- `MEDIUM` - Moderate issues requiring attention  
- `HIGH` - Critical errors requiring immediate action

### 🛠️ Error Handling Functions

#### **throwBWAError()**
Primary function for throwing professional errors with automatic notification dispatch:

```typescript
import { throwBWAError, BWAErrorCode, BWAErrorSeverity } from 'bitcoin-wallet-adapter';

// Throws error AND triggers snackbar notifications
throwBWAError(
  BWAErrorCode.WALLET_NOT_SUPPORTED, 
  "Phantom wallet does not support this operation",
  {
    severity: BWAErrorSeverity.HIGH,
    context: { 
      operation: 'btc_payment',
      walletType: 'Phantom' 
    }
  }
);
```

#### **wrapAndThrowError()**
Wraps existing errors with professional context:

```typescript
import { wrapAndThrowError, BWAErrorCode } from 'bitcoin-wallet-adapter';

try {
  await someWalletOperation();
} catch (originalError) {
  wrapAndThrowError(
    originalError,
    BWAErrorCode.TRANSACTION_SIGNING_FAILED,
    "Failed to sign transaction with Unisat wallet",
    { operation: 'transaction_signing', walletType: 'Unisat' }
  );
}
```

#### **useErrorHandler() Hook**
React hook for handling errors with automatic UI notifications:

```typescript
import { useErrorHandler, BWAErrorCode } from 'bitcoin-wallet-adapter';

function MyComponent() {
  const { errors, clearErrors, hasError } = useErrorHandler({
    onError: (error) => {
      // Automatically dispatches snackbar notifications
      console.log('Error handled:', error.code, error.message);
    },
    filterCodes: [BWAErrorCode.WALLET_NOT_CONNECTED], // Optional filtering
    filterSeverity: [BWAErrorSeverity.HIGH], // Optional severity filtering
    autoClearTimeout: 5000 // Auto-clear errors after 5 seconds
  });

  return (
    <div>
      {hasError(BWAErrorCode.WALLET_NOT_CONNECTED) && (
        <p>Please connect your wallet first!</p>
      )}
    </div>
  );
}
```

### ✨ Benefits of Professional Error Handling

- **🎯 Consistent Experience**: All errors follow the same professional format
- **📱 Automatic Notifications**: Errors automatically trigger snackbar notifications  
- **🔍 Rich Context**: Detailed error context for debugging and user guidance
- **⚡ Type Safety**: Full TypeScript support with professional error codes
- **📊 Error Tracking**: Built-in error history and analytics
- **🎛️ Configurable**: Filter by codes, severity, auto-clear options
- **♻️ Recoverable**: Errors marked as recoverable allow retry mechanisms

### 🎨 Integration with UI Components

The error handling system automatically integrates with the notification system:

```typescript
import { useErrorHandler } from 'bitcoin-wallet-adapter';

function App() {
  // This automatically handles errors and shows snackbar notifications
  useErrorHandler({
    onError: (error) => {
      // Errors are automatically dispatched to Redux notifications
      // Snackbars appear automatically with proper styling
    }
  });

  return <YourAppComponents />;
}
```

### 🔄 Migration from Legacy Error Handling

**❌ Old Pattern (Deprecated):**
```typescript
// DON'T USE - Legacy patterns
throw new Error("Something went wrong");
setError(new Error("Manual error"));
dispatch(addNotification({ message: "Error", severity: "error" }));
```

**✅ New Pattern (Recommended):**
```typescript
// USE THIS - Professional error handling
throwBWAError(
  BWAErrorCode.VALIDATION_ERROR,
  "Invalid transaction parameters provided",
  {
    severity: BWAErrorSeverity.MEDIUM,
    context: { operation: 'transaction_validation' }
  }
);
```

## 👛 Supported Wallets

Bitcoin Wallet Adapter currently supports the following wallets:

- 🦄 Unisat
- 🌌 Xverse
- 🐂 Leather/Hiro
- 🔮 MagicEden
- 👻 Phantom
- 🅾️ OKX

## 🎨 Headless Hooks (Advanced Usage)

For developers who want **complete control** over their wallet UI design, we provide headless hooks that separate logic from presentation. These hooks give you all the wallet functionality without any predefined UI components.

### 🚀 Why Use Headless Hooks?

- ✨ **Complete Design Freedom**: Build any UI you want
- 🎯 **Logic Separation**: Clean separation between wallet logic and presentation
- 🔧 **Maximum Flexibility**: Customize every aspect of the user experience
- 📱 **Framework Agnostic**: Logic works with any design system or component library

### 📖 Available Headless Hooks

#### 🔌 useWalletConnect

The core hook for wallet connection management:

```typescript
import { useWalletConnect } from 'bitcoin-wallet-adapter';

function CustomWalletConnect() {
  const {
    // Connection State
    isConnected,
    isLoading,
    error,
    
    // Wallet Information
    currentWallet,
    lastWallet,
    availableWallets,
    
    // Actions
    connect,
    disconnect,
    
    // Utilities
    checkAvailableWallets,
    refreshBalance
  } = useWalletConnect();

  return (
    <div className="my-custom-design">
      {isConnected ? (
        <div>
          <h3>Connected to {currentWallet?.wallet}</h3>
          <p>Cardinal: {currentWallet?.cardinal}</p>
          <p>Ordinal: {currentWallet?.ordinal}</p>
          <button onClick={disconnect}>Disconnect</button>
        </div>
      ) : (
        <div>
          <h3>Choose a Wallet</h3>
          {availableWallets.map((wallet) => (
            <button
              key={wallet.connector}
              onClick={() => connect(wallet.connector)}
              disabled={isLoading}
            >
              <img src={wallet.logo} alt={wallet.label} />
              {wallet.label}
            </button>
          ))}
          {error && <p>Error: {error.message}</p>}
        </div>
      )}
    </div>
  );
}
```

#### 💰 useWalletBalance

Manage wallet balance and BTC price:

```typescript
import { useWalletBalance } from 'bitcoin-wallet-adapter';

function CustomBalanceDisplay() {
  const {
    // Balance State
    balance,
    btcPrice,
    isLoading,
    error,
    
    // Actions
    refreshBalance,
    
    // Utilities
    formatBalance,
    formatPrice
  } = useWalletBalance();

  return (
    <div className="balance-container">
      <div className="balance-card">
        <h4>Wallet Balance</h4>
        {isLoading ? (
          <div>Loading balance...</div>
        ) : (
          <>
            <div className="btc-balance">
              <span>{formatBalance(balance.btc || 0)} BTC</span>
              <small>${formatPrice((balance.btc || 0) * btcPrice)}</small>
            </div>
            <div className="sats-balance">
              <span>{balance.sats?.toLocaleString()} sats</span>
            </div>
          </>
        )}
        <button onClick={refreshBalance} disabled={isLoading}>
          Refresh Balance
        </button>
        {error && <p className="error">{error.message}</p>}
      </div>
    </div>
  );
}
```

#### ✍️ useWalletSigning

Handle message and transaction signing:

```typescript
import { useWalletSigning } from 'bitcoin-wallet-adapter';

function CustomSigning() {
  const {
    // Signing State
    isLoading,
    error,
    lastSignature,
    
    // Actions
    signMessage,
    signTransaction,
    signPSBT,
    
    // Utilities
    verifySignature,
    clearError
  } = useWalletSigning();

  const handleSignMessage = async () => {
    try {
      const signature = await signMessage({
        message: "Hello Bitcoin!",
        address: "current-wallet-address"
      });
      console.log("Message signed:", signature);
    } catch (err) {
      console.error("Signing failed:", err);
    }
  };

  const handleSignTransaction = async () => {
    try {
      const result = await signTransaction({
        psbt: "your-psbt-here",
        network: "mainnet",
        action: "sell"
      });
      console.log("Transaction signed:", result);
    } catch (err) {
      console.error("Transaction signing failed:", err);
    }
  };

  return (
    <div className="signing-interface">
      <div className="signing-actions">
        <button 
          onClick={handleSignMessage}
          disabled={isLoading}
        >
          {isLoading ? 'Signing...' : 'Sign Message'}
        </button>
        
        <button 
          onClick={handleSignTransaction}
          disabled={isLoading}
        >
          {isLoading ? 'Signing...' : 'Sign Transaction'}
        </button>
      </div>

      {lastSignature && (
        <div className="signature-result">
          <h4>Last Signature:</h4>
          <pre>{JSON.stringify(lastSignature, null, 2)}</pre>
        </div>
      )}

      {error && (
        <div className="error-message">
          <p>Error: {error.message}</p>
          <button onClick={clearError}>Clear Error</button>
        </div>
      )}
    </div>
  );
}
```

### 🎨 Building Custom Components

You can combine these headless hooks to create sophisticated wallet interfaces:

```typescript
import { 
  useWalletConnect, 
  useWalletBalance, 
  useWalletSigning 
} from 'bitcoin-wallet-adapter';

function CompleteCustomWallet() {
  const { isConnected, connect, disconnect, availableWallets, currentWallet } = useWalletConnect();
  const { balance, formatBalance } = useWalletBalance();
  const { signMessage, isLoading: isSigning } = useWalletSigning();

  if (!isConnected) {
    return (
      <div className="connect-interface">
        <h2>Connect Your Bitcoin Wallet</h2>
        <div className="wallet-grid">
          {availableWallets.map((wallet) => (
            <div 
              key={wallet.connector}
              className="wallet-option"
              onClick={() => connect(wallet.connector)}
            >
              <img src={wallet.logo} alt={wallet.label} />
              <span>{wallet.label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="wallet-dashboard">
      <header className="wallet-header">
        <h2>{currentWallet?.wallet} Connected</h2>
        <button onClick={disconnect} className="disconnect-btn">
          Disconnect
        </button>
      </header>

      <div className="wallet-content">
        <div className="balance-section">
          <h3>Balance: {formatBalance(balance.btc || 0)} BTC</h3>
          <small>{balance.sats?.toLocaleString()} sats</small>
        </div>

        <div className="actions-section">
          <button 
            onClick={() => signMessage({ 
              message: "Custom message", 
              address: currentWallet?.cardinal || "" 
            })}
            disabled={isSigning}
          >
            Sign Message
          </button>
        </div>
      </div>
    </div>
  );
}
```





## 🤝 Contributing

We welcome contributions to the Bitcoin Wallet Adapter! Please read our [CONTRIBUTING.md](./CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests. Let's build the future of Bitcoin wallets together! 🚀

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 🌐 Connect with Us

[![X](https://img.shields.io/badge/X-black.svg?logo=X&logoColor=white)](https://x.com/crypticmetadev)
[![Codepen](https://img.shields.io/badge/Codepen-000000?style=for-the-badge&logo=codepen&logoColor=white)](https://codepen.io/crypticmeta)
[![Twitter](https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/crypticmeta)

## 💻 Tech Stack

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Redux](https://img.shields.io/badge/redux-%23593d88.svg
