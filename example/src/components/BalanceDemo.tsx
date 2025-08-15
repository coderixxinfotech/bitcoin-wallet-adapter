import React from 'react';
import { useWalletAddress, useWalletBalance } from "../../../dist";

/**
 * BalanceDemo Component
 * 
 * This component tests:
 * - useWalletBalance hook functionality for fetching Bitcoin wallet balances
 * - Real-time BTC price integration and USD value calculations
 * - Balance formatting utilities (BTC and satoshi display)
 * - Error handling for balance fetching failures
 * - Loading states during balance retrieval
 * - Integration with connected wallet addresses
 */
const BalanceDemo: React.FC = () => {
    const walletAddress = useWalletAddress();
    const { balance, btcPrice, isLoading, error, fetchBalance, formatBalance } = useWalletBalance();

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">💰 Balance Check Demo</h3>
            
            <div className="space-y-6">
                {/* Connection Status */}
                <div className="bg-slate-50 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-slate-700 mb-3">🔗 Wallet Connection</h4>
                    {walletAddress?.cardinal_address ? (
                        <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${
                                walletAddress?.connected ? 'bg-emerald-500' : 'bg-red-500'
                            }`}></div>
                            <span className={`text-sm font-medium ${
                                walletAddress?.connected ? 'text-emerald-600' : 'text-red-600'
                            }`}>
                                {walletAddress?.connected ? 'Connected' : 'Not Connected'}
                            </span>
                        </div>
                    ) : (
                        <div className="text-amber-600 bg-amber-50 p-3 rounded border border-amber-200">
                            ⚠️ Please connect your wallet first to check balance
                        </div>
                    )}
                </div>

                {/* Balance Fetching */}
                <div className="bg-slate-50 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-slate-700 mb-3">📊 Balance Information</h4>
                    <div className="flex gap-3 mb-4">
                        <button
                            onClick={fetchBalance}
                            disabled={!walletAddress?.connected || isLoading}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                !walletAddress?.connected || isLoading
                                    ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                                    : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                        >
                            {isLoading ? 'Fetching...' : 'Fetch Balance'}
                        </button>
                        {balance.btc !== null && (
                            <button
                                onClick={() => window.location.reload()}
                                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-600 hover:text-slate-800 transition-colors"
                            >
                                Clear
                            </button>
                        )}
                    </div>

                    {balance.btc !== null && (
                        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-4">
                            <h3 className="font-semibold text-emerald-800 mb-3">Balance Information</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-slate-600">Total BTC:</span>
                                    <span className="font-mono font-semibold">{formatBalance(balance.total || 0, 8)} BTC</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-600">Confirmed:</span>
                                    <span className="font-mono">{formatBalance(balance.confirmed || 0, 8)} BTC</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-600">Unconfirmed:</span>
                                    <span className="font-mono">{formatBalance(balance.unconfirmed || 0, 8)} BTC</span>
                                </div>
                                {balance.usd !== null && (
                                    <div className="flex justify-between pt-2 border-t border-emerald-200">
                                        <span className="text-slate-600">USD Value:</span>
                                        <span className="font-semibold">${balance.usd.toFixed(2)}</span>
                                        {btcPrice && (
                                            <span className="text-xs text-slate-500 ml-2">(@ ${btcPrice.toFixed(2)}/BTC)</span>
                                        )}
                                    </div>
                                )}
                            </div>
                            {walletAddress?.cardinal_address && (
                                <div className="text-sm text-emerald-700 mt-3 pt-3 border-t border-emerald-200">
                                    <span className="font-medium">Address:</span>
                                    <div className="font-mono text-xs bg-white p-2 rounded mt-1 break-all border">
                                        {walletAddress.cardinal_address}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Error Display */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                            <div className="text-red-800 font-semibold mb-2">❌ Error</div>
                            <div className="text-red-700">{error ? (typeof error === 'object' && 'message' in error ? error.message : String(error)) : 'Unknown error'}</div>
                        </div>
                    )}

                    {/* Loading State */}
                    {isLoading && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                            <div className="text-blue-800 font-semibold mb-2">🔄 Loading</div>
                            <div className="text-blue-700">Fetching balance from blockchain...</div>
                        </div>
                    )}
                </div>

                {/* Information */}
                <div className="bg-slate-50 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-slate-700 mb-3">ℹ️ Information</h4>
                    <ul className="text-slate-600 space-y-2 text-sm">
                        <li>• <strong>Cardinal Address:</strong> Your main Bitcoin payment address</li>
                        <li>• <strong>Balance Source:</strong> Wallet adapter's built-in balance fetching</li>
                        <li>• <strong>Network:</strong> Depends on wallet configuration</li>
                        <li>• <strong>Precision:</strong> Balance shown with up to 8 decimal places</li>
                        <li>• <strong>USD Conversion:</strong> Uses live BTC price from Redux store when available</li>
                        <li>• <strong>Price Source:</strong> Updated automatically when wallet connects</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default BalanceDemo;
