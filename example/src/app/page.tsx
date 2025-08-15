"use client";
import {
  Notification,
  useWalletAddress,
  useErrorHandler,
  BWAError,
  addNotification,
  ConnectMultiButton,
} from "../../../dist";
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';


import DebugWindow from "@/components/DebugWindow";
import WalletConnectDemo from "../components/WalletConnectDemo";
import MessageSignDemo from "../components/MessageSignDemo";
import BalanceDemo from "../components/BalanceDemo";
import PaymentDemo from "../components/PaymentDemo";



function HomeContent() {
  const dispatch = useDispatch();
  const walletDetails = useWalletAddress();
  const [debugWindowOpen, setDebugWindowOpen] = useState(false);
  // Load last active tab from localStorage, default to 'connect'
  const [activeTab, setActiveTab] = useState<'connect' | 'signing' | 'balance' | 'payment'>(() => {
    if (typeof window !== 'undefined') {
      const savedTab = localStorage.getItem('bitcoinWalletAdapter_activeTab');
      if (savedTab && ['connect', 'signing', 'balance', 'payment'].includes(savedTab)) {
        return savedTab as 'connect' | 'signing' | 'balance' | 'payment';
      }
    }
    return 'connect';
  });

  // Save active tab to localStorage when it changes
  const handleTabChange = (tab: 'connect' | 'signing' | 'balance' | 'payment') => {
    setActiveTab(tab);
    localStorage.setItem('bitcoinWalletAdapter_activeTab', tab);
  };

  // Professional error handling
  const { errors, clearErrors } = useErrorHandler({
    onError: (bwaError: InstanceType<typeof BWAError>) => {
      console.error('BWA Error:', bwaError);
      dispatch(addNotification({
        id: Date.now().toString(),
        type: 'error',
        message: `${bwaError.context?.walletType || 'Wallet'} Error: ${bwaError.message}`,
        duration: 5000,
      }));
    }
  });

  // Global error boundary for wallet adapter errors
  useEffect(() => {
    const handleUnhandledError = (event: ErrorEvent) => {
      // Check if it's a wallet adapter error
      if (event.error instanceof BWAError) {
        console.error('Unhandled BWA Error:', event.error);
        dispatch(addNotification({
          id: Date.now().toString(),
          type: 'error',
          message: `Unhandled Error: ${event.error.message}`,
          duration: 5000,
        }));
      }
    };

    window.addEventListener('error', handleUnhandledError);
    return () => window.removeEventListener('error', handleUnhandledError);
  }, [dispatch]);



  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 text-black py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-slate-900 mb-4 tracking-tight">
            Bitcoin Wallet Adapter
          </h1>
          <p className="text-xl text-slate-600 mb-2 font-medium">
            Wallet Connection Demo
          </p>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Connect and manage Bitcoin wallets with professional-grade integration
          </p>

          {/* Primary Connect Button - Recommended Default Sign-in Method */}
          <div className="bg-white rounded-2xl px-8 py-6 shadow-sm border border-slate-200 mb-8">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Connect Your Bitcoin Wallet</h3>
              <p className="text-slate-600 text-sm mb-4">Recommended sign-in method - persists wallet data after page refresh</p>
              <ConnectMultiButton network="mainnet" />
            </div>
            
            {/* Connection Status */}
            <div className="flex items-center justify-center gap-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${
                  walletDetails?.connected ? 'bg-emerald-500 shadow-sm shadow-emerald-500/50' : 'bg-slate-300'
                }`} />
                <span className={`text-sm font-semibold ${
                  walletDetails?.connected ? 'text-emerald-700' : 'text-slate-500'
                }`}>
                  {walletDetails?.connected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
              {walletDetails?.connected && (
                <div className="text-sm text-slate-700 font-medium bg-slate-100 px-3 py-1 rounded-lg">
                  {walletDetails.wallet}
                </div>
              )}
            </div>
          </div>
        </div>



        {/* Tab-Based Demo Interface */}
        <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 overflow-hidden mb-8">
          {/* Tab Navigation */}
          <div className="border-b border-slate-200 bg-slate-50">
            <div className="flex">
              <button
                onClick={() => handleTabChange('connect')}
                className={`px-6 py-4 font-semibold text-sm transition-all duration-200 border-b-2 ${activeTab === 'connect'
                    ? 'border-blue-500 text-blue-600 bg-white'
                    : 'border-transparent text-slate-600 hover:text-slate-800 hover:bg-slate-100'
                  }`}
              >
                🔗 Wallet Connect
              </button>
              <button
                onClick={() => handleTabChange('signing')}
                className={`px-6 py-4 font-semibold text-sm transition-all duration-200 border-b-2 ${activeTab === 'signing'
                    ? 'border-blue-500 text-blue-600 bg-white'
                    : 'border-transparent text-slate-600 hover:text-slate-800 hover:bg-slate-100'
                  }`}
              >
                ✍️ Message Signing
              </button>
              <button
                onClick={() => handleTabChange('balance')}
                className={`px-6 py-4 font-semibold text-sm transition-all duration-200 border-b-2 ${activeTab === 'balance'
                    ? 'border-blue-500 text-blue-600 bg-white'
                    : 'border-transparent text-slate-600 hover:text-slate-800 hover:bg-slate-100'
                  }`}
              >
                💰 Balance Check
              </button>
              <button
                onClick={() => handleTabChange('payment')}
                className={`px-6 py-4 font-semibold text-sm transition-all duration-200 border-b-2 ${activeTab === 'payment'
                    ? 'border-blue-500 text-blue-600 bg-white'
                    : 'border-transparent text-slate-600 hover:text-slate-800 hover:bg-slate-100'
                  }`}
              >
                💸 Payment Demo
              </button>

            </div>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {/* Wallet Connect Tab */}
            {activeTab === 'connect' && (
              <div>
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-slate-900 mb-3">
                    Wallet Connect Demo
                  </h2>
                  <p className="text-slate-600 text-lg">
                    Test wallet connection functionality and management features
                  </p>
                </div>
                <WalletConnectDemo />
              </div>
            )}

            {/* Message Signing Tab */}
            {activeTab === 'signing' && (
              <div>
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-slate-900 mb-3">
                    Message Signing Demo
                  </h2>
                  <p className="text-slate-600 text-lg">
                    Sign messages with your Bitcoin wallet to prove ownership and authenticate actions
                  </p>
                </div>
                <MessageSignDemo />
              </div>
            )}



            {/* Balance Check Tab */}
            {activeTab === 'balance' && (
              <div>
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-slate-900 mb-3">
                    Balance Check Demo
                  </h2>
                  <p className="text-slate-600 text-lg">
                    Check your Bitcoin wallet balance using the built-in balance fetching capabilities
                  </p>
                </div>
                <BalanceDemo />
              </div>
            )}

            {/* Payment Demo Tab */}
            {activeTab === 'payment' && (
              <div>
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-slate-900 mb-3">
                    Payment Demo
                  </h2>
                  <p className="text-slate-600 text-lg">
                    Demonstrate Bitcoin payment capabilities with the PayButton component
                  </p>
                </div>
                <PaymentDemo />
              </div>
            )}


          </div>
        </div>

        {/* Error Summary */}
        {errors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-red-600 text-sm">⚠️</span>
                </div>
                <h4 className="text-red-900 font-bold text-lg">Recent Errors ({errors.length})</h4>
              </div>
              <button
                onClick={clearErrors}
                className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors duration-200"
              >
                Clear All
              </button>
            </div>
            <div className="space-y-3">
              {errors.slice(-3).map((error, index) => (
                <div key={index} className="text-red-800 text-sm bg-red-100 p-4 rounded-xl border border-red-200">
                  <div className="font-semibold text-red-900 mb-1">
                    {(error as any).context?.walletType || 'Wallet'} Error:
                  </div>
                  <div className="text-red-700">{(error as any).message}</div>
                </div>
              ))}
            </div>
          </div>
        )}


      </div>

      {/* Notification System */}
      <Notification />

      {/* Debug Window */}
      <DebugWindow
        isOpen={debugWindowOpen}
        onToggle={() => setDebugWindowOpen(!debugWindowOpen)}
      />
    </main>
  );
}

export default function Home() {
  return <HomeContent />;
}
