/**
 * Debug Window Component
 * Provides comprehensive debugging interface for the Bitcoin Wallet Adapter
 */

"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useDevTools, addNotification, useBitcoinPrice } from '../../../dist';

interface ErrorLog {
  id: string;
  timestamp: number;
  message: string;
  stack?: string;
  source: 'wallet' | 'app' | 'network' | 'unknown';
  level: 'error' | 'warning' | 'info';
}

interface DebugWindowProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function DebugWindow({ isOpen, onToggle }: DebugWindowProps) {
  const [errors, setErrors] = useState<ErrorLog[]>([]);
  const [activeTab, setActiveTab] = useState<'errors' | 'prices' | 'redux' | 'network' | 'test'>('errors');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const devTools = useDevTools();
  const dispatch = useDispatch();

  // Use Bitcoin price hook from the package
  const {
    bitcoinPrice,
    fetchPrice,
    enableAutoRefresh,
    isLoading,
    hasError,
    hasData,
    averagePrice,
    lastUpdated
  } = useBitcoinPrice();

  // Error logging function
  const addError = useCallback((message: string, stack?: string, source: ErrorLog['source'] = 'unknown', level: ErrorLog['level'] = 'error') => {
    const newError: ErrorLog = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      message,
      stack,
      source,
      level,
    };

    setErrors(prev => [newError, ...prev.slice(0, 99)]); // Keep last 100 errors
    console.log(`🚨 Debug Window - ${level.toUpperCase()}:`, message, stack);
  }, []);

  // Global error listener
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      addError(
        event.message,
        event.error?.stack,
        'app',
        'error'
      );
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      addError(
        `Unhandled Promise Rejection: ${event.reason}`,
        event.reason?.stack,
        'app',
        'error'
      );
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [addError]);

  // Handle Bitcoin price errors and add them to debug log
  useEffect(() => {
    if (bitcoinPrice.data?.errors && bitcoinPrice.data.errors.length > 0) {
      bitcoinPrice.data.errors.forEach((error: any) => {
        addError(`Price fetch failed from ${error.source}: ${error.error}`, undefined, 'network', 'warning');
      });
    }
    if (bitcoinPrice.error) {
      addError(
        `Failed to fetch Bitcoin prices: ${bitcoinPrice.error}`,
        undefined,
        'network',
        'error'
      );
    }
  }, [bitcoinPrice.data?.errors, bitcoinPrice.error, addError]);

  // Handle auto-refresh toggle
  const handleAutoRefreshToggle = useCallback((enabled: boolean) => {
    enableAutoRefresh(enabled);
  }, [enableAutoRefresh]);

  // Expose addError to global scope for wallet adapter errors
  useEffect(() => {
    (window as any).bwaDebugAddError = addError;
    return () => {
      delete (window as any).bwaDebugAddError;
    };
  }, [addError]);

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-4 right-4 bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-full shadow-lg z-50 transition-all"
        title="Open Debug Window"
      >
        🐛
      </button>
    );
  }

  return (
    <div className={`fixed bottom-4 right-4 bg-gray-900 text-white rounded-lg shadow-2xl z-50 transition-all ${isCollapsed ? 'w-80 h-12' : 'w-96 h-96'
      }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-700 bg-gray-800 rounded-t-lg">
        <h3 className="text-sm font-bold text-orange-400">🪙 BWA Debug Window</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleAutoRefreshToggle(!bitcoinPrice.autoRefresh)}
            className={`text-xs px-2 py-1 rounded ${bitcoinPrice.autoRefresh ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-300'
              }`}
            title="Toggle auto-refresh"
          >
            {bitcoinPrice.autoRefresh ? '🔄' : '⏸️'}
          </button>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-gray-400 hover:text-white text-lg"
            title={isCollapsed ? 'Expand' : 'Collapse'}
          >
            {isCollapsed ? '⬆️' : '⬇️'}
          </button>
          <button
            onClick={onToggle}
            className="text-gray-400 hover:text-white text-lg"
            title="Close Debug Window"
          >
            ✕
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <>
          {/* Tabs */}
          <div className="flex border-b border-gray-700 bg-gray-800">
            {(['errors', 'prices', 'redux', 'network', 'test'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-3 py-2 text-xs font-medium capitalize ${activeTab === tab
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
                  }`}
              >
                {tab}
                {tab === 'errors' && errors.length > 0 && (
                  <span className="ml-1 bg-red-500 text-white rounded-full px-1 text-xs">
                    {errors.length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="p-3 h-80 overflow-y-auto text-xs">
            {activeTab === 'test' && (
              <div className="space-y-2">
                <h4 className="font-bold text-green-400">🧪 Test Utilities</h4>

                {/* Test Notifications */}
                <div className="p-3 bg-blue-900 rounded border border-blue-500">
                  <div className="space-y-2">
                    <h5 className="font-bold text-blue-300 mb-2">📢 Force Snackbar Notifications</h5>
                    <p className="text-gray-300 text-xs mb-3">Click buttons below to test snackbar notifications directly</p>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          console.log('🧪 Forcing SUCCESS notification');
                          dispatch(addNotification({
                            id: Date.now(),
                            message: 'Test success notification - Snackbar working!',
                            severity: 'success',
                            open: true
                          }));
                        }}
                        className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-xs rounded"
                      >
                        ✅ Success
                      </button>
                      <button
                        onClick={() => {
                          console.log('🧪 Forcing ERROR notification');
                          dispatch(addNotification({
                            id: Date.now() + 1,
                            message: 'Test error notification - Something went wrong!',
                            severity: 'error',
                            open: true
                          }));
                        }}
                        className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-xs rounded"
                      >
                        ❌ Error
                      </button>
                      <button
                        onClick={() => {
                          console.log('🧪 Forcing WARNING notification');
                          dispatch(addNotification({
                            id: Date.now() + 2,
                            message: 'Test warning notification - Please be careful!',
                            severity: 'warning',
                            open: true
                          }));
                        }}
                        className="px-3 py-2 bg-yellow-600 hover:bg-yellow-700 text-white text-xs rounded"
                      >
                        ⚠️ Warning
                      </button>
                      <button
                        onClick={() => {
                          console.log('🧪 Forcing INFO notification');
                          dispatch(addNotification({
                            id: Date.now() + 3,
                            message: 'Test info notification - Just so you know...',
                            severity: 'info',
                            open: true
                          }));
                        }}
                        className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded"
                      >
                        ℹ️ Info
                      </button>
                    </div>
                  </div>
                </div>

                {/* Redux State Debug */}
                <div className="p-3 bg-purple-900 rounded border border-purple-500">
                  <div className="space-y-2">
                    <h5 className="font-bold text-purple-300 mb-2">🔍 Debug Info</h5>
                    <button
                      onClick={() => {
                        const state = devTools?.getState();
                        console.log('📊 Current Redux State:', state);
                        console.log('📢 Current Notifications:', state?.notifications);
                      }}
                      className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs rounded mr-2"
                    >
                      🔍 Log Redux State
                    </button>
                    <button
                      onClick={() => {
                        console.log('🧪 Testing console log visibility');
                        addError('Test error from Debug Window', undefined, 'app', 'info');
                      }}
                      className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs rounded"
                    >
                      📝 Test Console Log
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'errors' && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-red-400">Error Log ({errors.length})</h4>
                  <button
                    onClick={() => setErrors([])}
                    className="text-gray-400 hover:text-white text-xs"
                  >
                    Clear All
                  </button>
                </div>
                {errors.length === 0 ? (
                  <p className="text-gray-500 italic">No errors logged</p>
                ) : (
                  errors.map(error => (
                    <div key={error.id} className={`p-2 rounded border-l-4 ${error.level === 'error' ? 'bg-red-900 border-red-500' :
                      error.level === 'warning' ? 'bg-yellow-900 border-yellow-500' :
                        'bg-blue-900 border-blue-500'
                      }`}>
                      <div className="flex justify-between">
                        <span className={`px-1 rounded text-xs ${error.level === 'error' ? 'bg-red-600' :
                          error.level === 'warning' ? 'bg-yellow-600' :
                            'bg-blue-600'
                          }`}>
                          {error.source}
                        </span>
                        <span className="text-gray-400">
                          {new Date(error.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="mt-1">{error.message}</p>
                      {error.stack && (
                        <details className="mt-1">
                          <summary className="cursor-pointer text-gray-400">Stack trace</summary>
                          <pre className="text-xs mt-1 text-gray-300 overflow-x-auto">
                            {error.stack}
                          </pre>
                        </details>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'prices' && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-orange-400">Bitcoin Prices</h4>
                  <button
                    onClick={() => fetchPrice()}
                    className="text-gray-400 hover:text-white text-xs bg-gray-700 px-2 py-1 rounded"
                  >
                    Refresh
                  </button>
                </div>
                {hasData && bitcoinPrice.data ? (
                  <div>
                    <div className="bg-green-900 p-2 rounded mb-2">
                      <div className="text-green-400 font-bold">
                        Average Price: ${averagePrice?.toFixed(2) || 'N/A'}
                      </div>
                      <div className="text-gray-400 text-xs">
                        Last updated: {lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : 'Never'}
                      </div>
                    </div>

                    <h5 className="font-bold text-gray-300 mb-1">Successful Sources:</h5>
                    {bitcoinPrice.data.prices?.map((price: any) => (
                      <div key={price.source} className="bg-gray-800 p-2 rounded mb-1">
                        <div className="flex justify-between">
                          <span className="text-blue-400">{price.source}</span>
                          <span className="text-green-400 font-mono">
                            ${price.price?.toFixed(2) || 'N/A'}
                          </span>
                        </div>
                      </div>
                    )) || []}

                    {bitcoinPrice.data.errors && bitcoinPrice.data.errors.length > 0 && (
                      <>
                        <h5 className="font-bold text-red-400 mb-1 mt-2">Failed Sources:</h5>
                        {bitcoinPrice.data.errors.map((error: any) => (
                          <div key={error.source} className="bg-red-900 p-2 rounded mb-1">
                            <div className="text-red-400">{error.source}</div>
                            <div className="text-gray-300 text-xs">{error.error}</div>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                ) : isLoading ? (
                  <p className="text-gray-500 italic">Loading Bitcoin prices...</p>
                ) : hasError ? (
                  <p className="text-red-400 italic">Failed to load Bitcoin prices</p>
                ) : (
                  <p className="text-gray-500 italic">No price data available</p>
                )}
              </div>
            )}

            {activeTab === 'redux' && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-purple-400">Redux State</h4>
                  <button
                    onClick={() => devTools?.logState()}
                    className="text-gray-400 hover:text-white text-xs bg-gray-700 px-2 py-1 rounded"
                  >
                    Log to Console
                  </button>
                </div>
                {devTools ? (
                  <div className="bg-gray-800 p-2 rounded">
                    <pre className="text-xs text-gray-300 overflow-x-auto">
                      {JSON.stringify(devTools.getState(), null, 2)}
                    </pre>
                  </div>
                ) : (
                  <p className="text-gray-500 italic">Redux DevTools not available</p>
                )}
              </div>
            )}

            {activeTab === 'network' && (
              <div className="space-y-2">
                <h4 className="font-bold text-cyan-400">Network Status</h4>
                <div className="bg-gray-800 p-2 rounded">
                  <div className="text-green-400">
                    Online: {navigator.onLine ? '✅' : '❌'}
                  </div>
                  <div className="text-gray-300">
                    Connection: {(navigator as any).connection?.effectiveType || 'Unknown'}
                  </div>
                  <div className="text-gray-300">
                    User Agent: {navigator.userAgent.slice(0, 50)}...
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
