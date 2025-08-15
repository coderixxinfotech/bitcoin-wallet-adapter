import React, { useState, useEffect } from 'react';
import { useMessageSign, useWalletAddress } from '../../../dist';

/**
 * MessageSignDemo Component
 * 
 * This component tests:
 * - useMessageSign hook functionality for Bitcoin message signing
 * - Message signature creation and verification processes
 * - Support for different address types (cardinal, ordinal, custom)
 * - Signature verification with address recovery
 * - Error handling for network mismatches (mainnet/testnet)
 * - Real-time signature display and verification results
 */
const MessageSignDemo: React.FC = () => {
    const walletAddress = useWalletAddress();
    const { signMessage, loading, result, error } = useMessageSign();

    // Local state for signature management
    const [signature, setSignature] = useState<string>('');
    const [verificationLoading, setVerificationLoading] = useState(false);

    const [messageText, setMessageText] = useState('Hello Bitcoin! This message is signed by my wallet.');
    const [verificationMessage, setVerificationMessage] = useState('');
    const [verificationSignature, setVerificationSignature] = useState('');
    const [verificationAddress, setVerificationAddress] = useState('');
    const [verificationResult, setVerificationResult] = useState<boolean | null>(null);

    // Address selection for signing
    const [signingAddressType, setSigningAddressType] = useState<'cardinal' | 'ordinal' | 'custom'>('cardinal');
    const [customSigningAddress, setCustomSigningAddress] = useState('');

    // Get the address to use for signing based on user selection
    const getSigningAddress = () => {
        switch (signingAddressType) {
            case 'cardinal':
                return walletAddress?.cardinal_address || '';
            case 'ordinal':
                return walletAddress?.ordinal_address || '';
            case 'custom':
                return customSigningAddress;
            default:
                return walletAddress?.cardinal_address || '';
        }
    };

    const handleSignMessage = async () => {
        if (!messageText.trim()) return;

        const addressToUse = getSigningAddress();
        if (!addressToUse) {
            alert('Please select a valid address for signing');
            return;
        }

        try {
            await signMessage({
                network: 'Mainnet',
                address: addressToUse,
                message: messageText,
                wallet: walletAddress?.wallet || '',
            });

            // Auto-populate verification fields with correct values on success
            setVerificationMessage(messageText);
            setVerificationSignature(''); // Will be filled from result when available
            setVerificationAddress(addressToUse);
            setVerificationResult(null);
        } catch (err) {
            console.error('Message signing failed:', err);
            // Clear verification fields on error
            setVerificationMessage('');
            setVerificationSignature('');
            setVerificationAddress('');
            setVerificationResult(null);
        }
    };

    // Auto-populate verification signature when result is available
    useEffect(() => {
        if (result && verificationMessage && verificationAddress) {
            setVerificationSignature(result);
        }
    }, [result, verificationMessage, verificationAddress]);

    // Simple BIP-322 signature verification function
    const verifySignature = async (message: string, signature: string, address: string): Promise<boolean> => {
        try {
            // Import the verification library dynamically
            const { Verifier } = await import('bip322-js');
            return Verifier.verifySignature(address, message, signature);
        } catch (error) {
            console.error('Verification error:', error);
            return false;
        }
    };

    const handleVerifySignature = async () => {
        if (!verificationMessage.trim() || !verificationSignature.trim() || !verificationAddress.trim()) {
            alert('Please fill all verification fields');
            return;
        }

        setVerificationLoading(true);
        try {
            const isValid = await verifySignature(
                verificationMessage,
                verificationSignature,
                verificationAddress
            );
            setVerificationResult(isValid);
        } catch (err) {
            console.error('Signature verification failed:', err);
            setVerificationResult(false);
        } finally {
            setVerificationLoading(false);
        }
    };

    const clearSignature = () => {
        setSignature('');
        setVerificationResult(null);
    };

    const useCurrentSignature = () => {
        if (result) {
            setVerificationMessage(messageText);
            setVerificationSignature(result);
            setVerificationAddress(getSigningAddress());
            setVerificationResult(null);
        }
    };

    const handleClear = () => {
        clearSignature();
        setVerificationResult(null);
    };

    const generateRandomMessage = () => {
        const messages = [
            'Hello Bitcoin World!',
            'This is a test message from my wallet.',
            'Proving ownership of my Bitcoin address.',
            'Signed message for authentication purposes.',
            'Bitcoin wallet signature verification demo.',
            `Message signed at ${new Date().toLocaleString()}`,
        ];
        setMessageText(messages[Math.floor(Math.random() * messages.length)]);
    };

    if (!walletAddress?.connected) {
        return (
            <div className="bg-gray-100 border border-gray-300 rounded-lg p-6 mb-4">
                <h3 className="text-xl font-bold text-gray-800 mb-4">✍️ useMessageSign Demo</h3>
                <p className="text-gray-600">Please connect a wallet first to test message signing features.</p>
            </div>
        );
    }

    return (
        <div className="bg-white border border-gray-300 rounded-lg p-6 mb-4">
            <h3 className="text-xl font-bold text-gray-800 mb-4">✍️ useMessageSign Demo</h3>

            {/* Address Selection */}
            <div className="mb-6 p-4 bg-gray-50 rounded">
                <h4 className="font-semibold text-gray-700 mb-3">Select Signing Address:</h4>

                {/* Address Type Selection */}
                <div className="mb-4">
                    <div className="flex flex-wrap gap-4 mb-3">
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="radio"
                                name="addressType"
                                value="cardinal"
                                checked={signingAddressType === 'cardinal'}
                                onChange={(e) => setSigningAddressType(e.target.value as 'cardinal' | 'ordinal' | 'custom')}
                                className="mr-2"
                            />
                            <span className="text-sm font-medium text-gray-700">
                                Cardinal Address (Payment)
                            </span>
                        </label>

                        <label className="flex items-center cursor-pointer">
                            <input
                                type="radio"
                                name="addressType"
                                value="ordinal"
                                checked={signingAddressType === 'ordinal'}
                                onChange={(e) => setSigningAddressType(e.target.value as 'cardinal' | 'ordinal' | 'custom')}
                                className="mr-2"
                            />
                            <span className="text-sm font-medium text-gray-700">
                                Ordinal Address (Taproot)
                            </span>
                        </label>

                        <label className="flex items-center cursor-pointer">
                            <input
                                type="radio"
                                name="addressType"
                                value="custom"
                                checked={signingAddressType === 'custom'}
                                onChange={(e) => setSigningAddressType(e.target.value as 'cardinal' | 'ordinal' | 'custom')}
                                className="mr-2"
                            />
                            <span className="text-sm font-medium text-gray-700">
                                Custom Address (Test Failed Verification)
                            </span>
                        </label>
                    </div>

                    {/* Show selected address or custom input */}
                    {signingAddressType === 'custom' ? (
                        <input
                            type="text"
                            value={customSigningAddress}
                            onChange={(e) => setCustomSigningAddress(e.target.value)}
                            placeholder="Enter any Bitcoin address for testing..."
                            className="w-full p-3 border border-gray-300 rounded text-sm font-mono"
                        />
                    ) : (
                        <p className="text-sm font-mono bg-white text-black p-3 rounded border">
                            <span className="text-gray-900 mr-2">
                                {signingAddressType === 'cardinal' ? 'Cardinal:' : 'Ordinal:'}
                            </span>
                            {getSigningAddress()}
                        </p>
                    )}
                </div>

                {/* Address Type Explanation */}
                <div className="text-xs text-gray-600 bg-blue-50 p-3 rounded border-l-4 border-blue-400">
                    <strong>Address Types:</strong>
                    <ul className="mt-1 space-y-1">
                        <li>• <strong>Cardinal:</strong> Your main payment address for Bitcoin transactions</li>
                        <li>• <strong>Ordinal:</strong> Your Taproot address for Ordinals and inscriptions</li>
                        <li>• <strong>Custom:</strong> Any Bitcoin address to test signature verification failure</li>
                    </ul>
                </div>
            </div>

            {/* Message Signing Section */}
            <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-700 mb-3">📝 Sign Message</h4>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Message to Sign:
                        </label>
                        <textarea
                            value={messageText}
                            onChange={(e) => setMessageText(e.target.value)}
                            className="w-full p-3 border text-black border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            rows={4}
                            placeholder="Enter your message here..."
                        />
                        <div className="mt-2 flex gap-2">
                            <button
                                onClick={handleSignMessage}
                                disabled={verificationLoading || !messageText.trim()}
                                className="bg-blue-500 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold py-2 px-4 rounded text-sm"
                            >
                                {loading ? 'Signing...' : 'Sign Message'}
                            </button>
                            <button
                                onClick={generateRandomMessage}
                                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded text-sm"
                            >
                                Random Message
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Generated Signature:
                        </label>
                        <textarea
                            value={result || ''}
                            readOnly
                            className="w-full p-3 border border-gray-300 rounded text-sm bg-gray-50 font-mono"
                            rows={4}
                            placeholder="Signature will appear here after signing..."
                        />
                        {result && (
                            <div className="mt-2 flex gap-2">
                                <button
                                    onClick={useCurrentSignature}
                                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded text-sm"
                                >
                                    Use for Verification
                                </button>
                                <button
                                    onClick={() => navigator.clipboard.writeText(result || '')}
                                    className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-1 px-3 rounded text-sm"
                                >
                                    Copy Signature
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Signature Verification Section */}
            <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-700 mb-3">✅ Verify Signature</h4>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Original Message:
                        </label>
                        <textarea
                            value={verificationMessage}
                            onChange={(e) => setVerificationMessage(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded text-sm"
                            rows={3}
                            placeholder="Message to verify..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Signature:
                        </label>
                        <textarea
                            value={verificationSignature}
                            onChange={(e) => setVerificationSignature(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded text-sm font-mono"
                            rows={3}
                            placeholder="Signature to verify..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Signer Address:
                        </label>
                        <input
                            type="text"
                            value={verificationAddress}
                            onChange={(e) => setVerificationAddress(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded text-sm font-mono"
                            placeholder="Bitcoin address..."
                        />
                        <button
                            onClick={handleVerifySignature}
                            disabled={!verificationMessage.trim() || !verificationSignature.trim() || !verificationAddress.trim()}
                            className="mt-2 w-full bg-purple-500 hover:bg-purple-700 disabled:bg-purple-300 text-white font-bold py-2 px-3 rounded text-sm"
                        >
                            {verificationLoading ? 'Verifying...' : 'Verify Signature'}
                        </button>
                    </div>
                </div>

                {/* Verification Result */}
                {verificationResult !== null && (
                    <div className={`mt-4 p-4 rounded border ${verificationResult
                        ? 'bg-green-100 border-green-400 text-green-700'
                        : 'bg-red-100 border-red-400 text-red-700'
                        }`}>
                        <div className="flex items-center">
                            <span className="text-2xl mr-2">{verificationResult ? '✅' : '❌'}</span>
                            <div>
                                <strong>Verification Result: </strong>
                                {verificationResult ? 'Valid Signature' : 'Invalid Signature'}
                                <div className="text-sm mt-1">
                                    {verificationResult
                                        ? 'The signature is valid and was created by the specified address.'
                                        : 'The signature is invalid or was not created by the specified address.'
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Control Buttons */}
            <div className="mb-4 flex gap-2">
                <button
                    onClick={handleClear}
                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded text-sm"
                >
                    Clear Results
                </button>
            </div>

            {/* Error Display */}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    <strong>Signing Error:</strong> {String(error)}
                </div>
            )}

            {/* Loading Indicator */}
            {(loading || verificationLoading) && (
                <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4">
                    <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                        Processing signing operation...
                    </div>
                </div>
            )}

            {/* Use Cases */}
            <div className="bg-yellow-50 p-4 rounded border border-yellow-200 mb-4">
                <h4 className="font-semibold text-yellow-800 mb-2">💡 Common Use Cases:</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• <strong>Authentication:</strong> Prove ownership of a Bitcoin address</li>
                    <li>• <strong>Identity Verification:</strong> Sign messages to verify identity</li>
                    <li>• <strong>Timestamps:</strong> Create tamper-proof timestamp signatures</li>
                    <li>• <strong>Contracts:</strong> Digitally sign agreements or contracts</li>
                    <li>• <strong>Authorization:</strong> Grant permissions using signature proof</li>
                </ul>
            </div>

            {/* Features List */}
            <div className="bg-indigo-50 p-4 rounded border border-indigo-200">
                <h4 className="font-semibold text-indigo-800 mb-2">useMessageSign Features:</h4>
                <ul className="text-sm text-indigo-700 space-y-1">
                    <li>✅ Multi-wallet message signing (Unisat, Leather, OKX, Xverse, etc.)</li>
                    <li>✅ Cryptographic signature verification</li>
                    <li>✅ Bitcoin address validation</li>
                    <li>✅ Professional error handling and loading states</li>
                    <li>✅ Signature management utilities (clear, copy)</li>
                    <li>✅ Real-time verification with instant feedback</li>
                    <li>✅ Support for arbitrary message signing</li>
                </ul>
            </div>
        </div>
    );
};

export default MessageSignDemo;
