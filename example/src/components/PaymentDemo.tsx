import React, { useState, useEffect } from 'react';
import { usePayBTC, useWalletAddress, useWalletBalance } from '../../../dist';

/**
 * PaymentDemo Component
 * 
 * This component demonstrates:
 * - BTC payment functionality using usePayBTC hook
 * - Payment transaction states and results
 * - Wallet balance display with BTC and USD amounts
 * - Manual recipient address input with localStorage persistence
 * - Quick test amounts and recipient selection
 * - Input validation and error handling
 * - Transaction confirmation and error display
 */
const PaymentDemo: React.FC = () => {
  const walletDetails = useWalletAddress();
  const { balance, isLoading: balanceLoading, error: balanceError, fetchBalance } = useWalletBalance();
  const { loading: paymentLoading, result: paymentResult, error: paymentError, payBTC } = usePayBTC();

  // Load recipient from localStorage or use default
  const [recipient, setRecipient] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('btc_payment_recipient') || 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh';
    }
    return 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh';
  });

  const [amount, setAmount] = useState('0.001');

  // Save recipient to localStorage whenever it changes
  useEffect(() => {
    if (recipient) {
      localStorage.setItem('btc_payment_recipient', recipient);
    }
  }, [recipient]);

  // Convert BTC to satoshis
  const amountSats = Math.round(parseFloat(amount || '0') * 100000000);

  // Predefined test amounts in BTC
  const testAmounts = ['0.0001', '0.001', '0.01', '0.05'];


  const isValidAmount = parseFloat(amount) > 0;
  const isValidRecipient = recipient && recipient.length > 20; // Basic validation

  // Handle payment execution
  const handlePayment = async () => {
    if (!walletDetails?.connected || !isValidAmount || !isValidRecipient) {
      return;
    }
    
    try {
      await payBTC({ address: recipient, amount: amountSats });
    } catch (error) {
      console.error('Payment failed:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-xl font-bold text-slate-900 mb-6">Bitcoin Payment Demo</h3>

        {/* Connection Status */}
        <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <h4 className="font-semibold text-slate-800 mb-2">Wallet Status</h4>
          {walletDetails?.connected ? (
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                <span className="text-green-700 font-medium">Connected to {walletDetails?.wallet || 'Unknown Wallet'}</span>
              </div>
              {walletDetails?.cardinal_address && (
                <div className="text-sm text-slate-600">
                  Address: {walletDetails.cardinal_address.slice(0, 12)}...{walletDetails.cardinal_address.slice(-12)}
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center">
              <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
              <span className="text-red-700 font-medium">No wallet connected</span>
            </div>
          )}
        </div>

        {/* Current Balance */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-blue-800">Wallet Balance</h4>
            <button
              onClick={fetchBalance}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              disabled={balanceLoading}
            >
              {balanceLoading ? 'Loading...' : 'Refresh ↻'}
            </button>
          </div>

          {balanceError && (
            <div className="text-red-600 text-sm mb-2">
              Error loading balance: {balanceError}
            </div>
          )}

          <div className="space-y-1">
            <div className="text-lg font-bold text-blue-900">
              {balance?.total !== null ? `${balance.total} BTC` : 'Loading...'}
              {balance?.total === 0 && (balance?.unconfirmed || 0) < 0 && (
                <span className="text-xs text-amber-600 ml-2 font-normal">(Pending transaction)</span>
              )}
            </div>
            {balance?.usd !== null && (
              <div className="text-sm text-blue-700">
                ≈ ${balance.usd} USD
                {balance?.total === 0 && balance?.usd > 0 && (
                  <span className="text-xs text-amber-600 ml-2">(USD calc may be incorrect)</span>
                )}
              </div>
            )}
            <div className="text-xs text-blue-600 space-y-1">
              <div>Confirmed: <span className="font-semibold">{balance?.confirmed || 'N/A'} BTC</span></div>
              <div>Unconfirmed: <span className={`font-semibold ${(balance?.unconfirmed || 0) < 0 ? 'text-amber-600' : 'text-green-600'}`}>
                {balance?.unconfirmed || 'N/A'} BTC
                {(balance?.unconfirmed || 0) < 0 && <span className="ml-1">(Outgoing)</span>}
              </span></div>
            </div>
          </div>
        </div>

        {/* Amount Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-2">Amount (BTC)</label>
          <input
            type="number"
            step="0.00000001"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isValidAmount ? 'border-slate-300' : 'border-red-300'
              }`}
            placeholder="Enter amount in BTC (e.g., 0.001)"
          />
          <div className="text-xs text-slate-500 mt-1">
            {isValidAmount ? `≈ ${amountSats.toLocaleString()} satoshis` : 'Invalid amount'}
          </div>
        </div>

        {/* Quick Amount Buttons */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-2">Quick Amounts</label>
          <div className="flex flex-wrap gap-2">
            {testAmounts.map((testAmount) => (
              <button
                key={testAmount}
                onClick={() => setAmount(testAmount)}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200 transition-colors"
              >
                {testAmount} BTC
              </button>
            ))}
          </div>
        </div>

        {/* Recipient Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-2">Recipient Address</label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isValidRecipient ? 'border-slate-300' : 'border-red-300'
              }`}
            placeholder="Enter Bitcoin address"
          />
        </div>


        {/* Validation Messages */}
        {(!walletDetails?.connected || !isValidAmount || !isValidRecipient) && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm">
            <strong>⚠️ Please check:</strong>
            <ul className="list-disc list-inside mt-1 text-yellow-800">
              {!walletDetails?.connected && <li>Connect a wallet first</li>}
              {!isValidAmount && <li>Enter a valid amount greater than 0</li>}
              {!isValidRecipient && <li>Enter a valid Bitcoin address</li>}
            </ul>
          </div>
        )}

        {/* Payment Results */}
        {paymentError && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <h4 className="font-semibold text-red-800 mb-2">Payment Error</h4>
            <p className="text-red-700 text-sm">{paymentError}</p>
          </div>
        )}

        {paymentResult && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2">Payment Successful!</h4>
            <div className="space-y-2 text-sm text-green-700">
              <p><strong>Transaction ID:</strong> <code className="bg-green-100 px-2 py-1 rounded text-xs">{
                typeof paymentResult === 'string' 
                  ? paymentResult 
                  : (paymentResult as any)?.txid || 
                    (paymentResult as any)?.transactionId || 
                    (paymentResult as any)?.id || 
                    (paymentResult as any)?.hash || 
                    'N/A'
              }</code></p>
              <p><strong>Amount:</strong> {amount} BTC ({amountSats.toLocaleString()} sats)</p>
              <p><strong>Recipient:</strong> <code className="bg-green-100 px-2 py-1 rounded text-xs">{recipient}</code></p>
              
              {/* Debug: Show full result structure */}
              <details className="mt-3">
                <summary className="cursor-pointer text-xs text-green-600 hover:text-green-800">Debug: Show full result</summary>
                <pre className="mt-2 p-2 bg-green-100 rounded text-xs overflow-auto">
                  {JSON.stringify(paymentResult, null, 2)}
                </pre>
              </details>
            </div>
          </div>
        )}

        {/* Payment Button */}
        <div className="flex justify-center">
          {walletDetails?.connected && isValidAmount && isValidRecipient ? (
            <button
              onClick={handlePayment}
              disabled={paymentLoading}
              className={`font-bold py-3 px-6 rounded-lg transition-colors duration-200 ${
                paymentLoading
                  ? 'bg-blue-400 text-blue-100 cursor-not-allowed'
                  : 'bg-green-500 hover:bg-green-700 text-white'
              }`}
            >
              {paymentLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending Payment...
                </span>
              ) : (
                `Pay ${amount || '0'} BTC`
              )}
            </button>
          ) : (
            <button
              disabled
              className="bg-gray-400 text-gray-600 font-bold py-3 px-6 rounded-lg cursor-not-allowed"
            >
              Pay {amount || '0'} BTC (Validation Required)
            </button>
          )}
        </div>
      </div>

      {/* Supported Wallets */}
      <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
        <h4 className="font-semibold text-purple-800 mb-2">Payment Demo Features:</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
          <div className="flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            <strong>Leather:</strong> Full support
          </div>
          <div className="flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            <strong>Xverse:</strong> Full support
          </div>
          <div className="flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            <strong>Unisat:</strong> Full support
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <h4 className="font-semibold text-amber-800 mb-2">🔧 How to Use:</h4>
        <ol className="list-decimal list-inside space-y-1 text-sm text-amber-800">
          <li>Connect a wallet using the button at the top of the page</li>
          <li>Enter or select an amount to send (use small amounts for testing)</li>
          <li>Enter or select a recipient Bitcoin address</li>
          <li>Click the "Pay" button to initiate the transaction</li>
          <li>Click the green "Pay X BTC" button to initiate the transaction</li>
          <li>Approve the transaction in your wallet popup</li>
          <li>The transaction will be broadcast to the Bitcoin network</li>
        </ol>
        <div className="mt-2 text-blue-600">
          <strong>⚠️ Note:</strong> This uses real Bitcoin transactions. Only use testnet or small amounts for testing!
        </div>
      </div>
    </div>
  );
};

export default PaymentDemo;
