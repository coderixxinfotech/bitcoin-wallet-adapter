import React, { useState } from 'react';
import { useWalletConnect, useWalletAddress } from '../../../dist';

/**
 * WalletConnectDemo Component
 * 
 * This component tests:
 * - useWalletConnect hook functionality for manual wallet connection/disconnection
 * - useWalletAddress hook for retrieving wallet address information
 * - Real-time connection status updates and error handling
 * - Available wallet detection and selection
 * - Manual wallet management workflow (select wallet → connect → disconnect)
 */
const WalletConnectDemo: React.FC = () => {
  const walletAddress = useWalletAddress();
  const {
    connect,
    disconnect,
    isLoading,
    error,
    availableWallets,
    currentWallet,
  } = useWalletConnect();

  const [selectedWallet, setSelectedWallet] = useState<string>('');

  const handleConnect = async () => {
    if (!selectedWallet) return;
    try {
      await connect(selectedWallet as any);
    } catch (err) {
      console.error('Connection failed:', err);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
    } catch (err) {
      console.error('Disconnection failed:', err);
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50 border border-slate-200 rounded-2xl p-8 mb-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
          <span className="text-white text-xl">🔗</span>
        </div>
        <div>
          <h3 className="text-2xl font-bold text-slate-900 mb-1">Wallet Connection Demo</h3>
          <p className="text-slate-600 text-sm">useWalletConnect & useWalletAddress hooks</p>
        </div>
      </div>
      <p className="text-slate-600 mb-8 leading-relaxed">
        This demo showcases professional Bitcoin wallet connection management with real-time status updates and error handling.
      </p>

      {/* Connection Status */}
      <div className="mb-8">
        <h4 className="font-bold text-slate-900 mb-4 text-lg flex items-center gap-2">
          📊 Connection Status
        </h4>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-600 font-medium">Status:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  walletAddress?.connected 
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                    : 'bg-slate-100 text-slate-600 border border-slate-200'
                }`}>
                  {walletAddress?.connected ? '✅ Connected' : '❌ Disconnected'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 font-medium">Loading:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  isLoading 
                    ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                    : 'bg-slate-100 text-slate-600 border border-slate-200'
                }`}>
                  {isLoading ? '🔄 Loading' : '✅ Ready'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 font-medium">Wallet:</span>
                <span className="px-3 py-1 bg-slate-100 text-slate-800 rounded-lg text-sm font-semibold border border-slate-200">
                  {currentWallet?.wallet || 'None'}
                </span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            {walletAddress?.connected ? (
              <div className="space-y-4">
                <div>
                  <p className="text-slate-600 font-medium mb-2">📍 Cardinal Address:</p>
                  <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg text-xs font-mono break-all text-slate-700">
                    {walletAddress.cardinal_address}
                  </div>
                </div>
                <div>
                  <p className="text-slate-600 font-medium mb-2">🎯 Ordinal Address:</p>
                  <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg text-xs font-mono break-all text-slate-700">
                    {walletAddress.ordinal_address}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-slate-400">
                  <div className="text-4xl mb-2">🔌</div>
                  <p className="text-sm">Connect a wallet to view addresses</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Wallet Selection */}
      {!walletAddress?.connected && (
        <div className="mb-8">
          <h4 className="font-bold text-slate-900 mb-4 text-lg flex items-center gap-2">
            🔗 Connect Wallet
          </h4>
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-slate-700 font-medium mb-2">Choose Wallet:</label>
                <select
                  value={selectedWallet}
                  onChange={(e) => setSelectedWallet(e.target.value)}
                  className="w-full p-4 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 focus:outline-none transition-all duration-200 bg-white text-slate-700"
                >
                  <option value="" className="text-slate-500">Select a wallet...</option>
                  {availableWallets.map((wallet: any) => (
                    <option key={wallet.label} value={wallet.label} className="text-slate-700">
                      {wallet.label} {wallet.installed ? '✅' : '❌'}
                    </option>
                  ))}
                </select>
              </div>
              <div className="sm:flex sm:items-end">
                <button
                  onClick={handleConnect}
                  disabled={!selectedWallet || isLoading}
                  className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 focus:ring-4 focus:ring-emerald-200 focus:outline-none"
                >
                  {isLoading ? '🔄 Connecting...' : `🔗 Connect ${selectedWallet || 'Wallet'}`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Disconnect Button */}
      {walletAddress?.connected && (
        <div className="mb-4">
          <button
            onClick={handleDisconnect}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Disconnect Wallet
          </button>
        </div>
      )}

      {/* Available Wallets */}
      <div className="mb-8">
        <h4 className="font-bold text-slate-900 mb-4 text-lg flex items-center gap-2">
          💼 Available Wallets
        </h4>
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(availableWallets as any[]).map((wallet: any) => (
              <div
                key={wallet.label || wallet.id || wallet}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  wallet.installed 
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900 shadow-sm' 
                    : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{wallet.label}</span>
                  <div className={`text-sm px-2 py-1 rounded-full ${
                    wallet.installed 
                      ? 'bg-emerald-200 text-emerald-800' 
                      : 'bg-slate-200 text-slate-600'
                  }`}>
                    {wallet.installed ? '✅ Installed' : '❌ Not Found'}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {availableWallets.length === 0 && (
            <div className="text-center py-8 text-slate-400">
              <div className="text-4xl mb-2">💼</div>
              <p>No wallets detected. Install a Bitcoin wallet extension to get started.</p>
            </div>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6">
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-red-600 text-sm">⚠️</span>
              </div>
              <div>
                <h4 className="font-bold text-red-900 mb-2">Connection Error</h4>
                <p className="text-red-700 leading-relaxed">{error.message}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Demo Features */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
            <span className="text-white text-lg">⚡</span>
          </div>
          <h4 className="font-bold text-blue-900 text-lg">useWalletConnect Features</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-sm text-blue-800">
            <span className="text-emerald-600 font-semibold">✅</span>
            <span>Multi-wallet support (Unisat, Xverse, Leather, etc.)</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-blue-800">
            <span className="text-emerald-600 font-semibold">✅</span>
            <span>Real-time connection status tracking</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-blue-800">
            <span className="text-emerald-600 font-semibold">✅</span>
            <span>Automatic wallet detection</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-blue-800">
            <span className="text-emerald-600 font-semibold">✅</span>
            <span>Professional error handling with user feedback</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-blue-800">
            <span className="text-emerald-600 font-semibold">✅</span>
            <span>TypeScript support with full type safety</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-blue-800">
            <span className="text-emerald-600 font-semibold">✅</span>
            <span>Headless design - complete UI control</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-blue-800">
            <span className="text-emerald-600 font-semibold">✅</span>
            <span>Graceful disconnection with cleanup</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletConnectDemo;
