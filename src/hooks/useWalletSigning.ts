import { useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useWallets } from "@wallet-standard/react";
import type { WalletWithFeatures } from "@wallet-standard/base";
import {
  BitcoinNetworkType,
  signMessage as signMessageSatsConnect,
} from "sats-connect";
import { Verifier } from "bip322-js";

import { RootState } from "../stores";
import { setSignature } from "../stores/reducers/generalReducer";
import { addNotification } from "../stores/reducers/notificationReducers";
import { 
  throwBWAError,
  BWAErrorCode,
  BWAErrorSeverity 
} from "../utils/errorHandler";

interface CustomWindow extends Window {
  LeatherProvider?: any;
  unisat?: any;
  BitcoinProvider?: any;
  btc?: any;
  phantom?: any;
  okxwallet?: any;
}

declare const window: CustomWindow;

const SatsConnectNamespace = "sats-connect:";

export interface SignMessageOptions {
  network: "testnet" | "mainnet";
  address: string;
  message: string;
  wallet: string;
  fractal?: boolean;
}

export interface SignTransactionOptions {
  network: "testnet" | "mainnet";
  address: string;
  recipient: string;
  amount: number;
  feeRate?: number;
  wallet: string;
  fractal?: boolean;
}

export interface UseWalletSigningReturn {
  // Signing State
  isLoading: boolean;
  error: Error | null;
  lastSignature: string | null;
  
  // Message Signing
  signMessage: (options: SignMessageOptions) => Promise<string>;
  verifyMessage: (message: string, signature: string, address: string) => Promise<boolean>;
  
  // Transaction Signing
  signTransaction: (options: SignTransactionOptions) => Promise<string>;
  
  // PSBT Signing
  signPSBT: (psbtHex: string, options?: { broadcast?: boolean }) => Promise<string>;
  
  // Utilities
  clearSignature: () => void;
}

/**
 * Headless hook for wallet signing operations
 * Provides message signing, transaction signing, and PSBT operations without UI
 */
export const useWalletSigning = (): UseWalletSigningReturn => {
  const dispatch = useDispatch();
  const { wallets: testWallets } = useWallets();
  
  const walletDetails = useSelector((state: RootState) => state.general.walletDetails);
  const signature = useSelector((state: RootState) => state.general.signature);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Sign a message with the connected wallet
   */
  const signMessage = useCallback(async (options: SignMessageOptions): Promise<string> => {
    if (!walletDetails?.cardinal) {
      throwBWAError(
        BWAErrorCode.WALLET_NOT_CONNECTED,
        "No wallet is currently connected for message signing",
        {
          severity: BWAErrorSeverity.HIGH,
          context: { 
            operation: 'message_signing',
            additionalData: { walletType: options.wallet }
          }
        }
      );
    }

    setIsLoading(true);
    setError(null);

    try {
      let signedMessage = "";

      switch (options.wallet.toLowerCase()) {
        case "unisat":
          signedMessage = await signMessageUnisat(options);
          break;
        case "leather":
          signedMessage = await signMessageLeather(options);
          break;
        case "xverse":
          signedMessage = await signMessageXverse(options);
          break;
        case "phantom":
          signedMessage = await signMessagePhantom(options);
          break;
        case "okx":
          signedMessage = await signMessageOKX(options);
          break;
        default:
          // Try Magic Eden wallets
          signedMessage = await signMessageMagicEden(options);
          break;
      }

      // Store signature in Redux
      dispatch(setSignature(signedMessage));
      
      dispatch(addNotification({
        id: Date.now(),
        message: "Message signed successfully!",
        open: true,
        severity: "success" as const,
      }));

      return signedMessage;

    } catch (err) {
      const error = err instanceof Error ? err : new Error('Signing failed');
      setError(error);
      
      dispatch(addNotification({
        id: Date.now(),
        message: err instanceof Error ? err.message : "Failed to sign message",
        open: true,
        severity: "error" as const,
      }));
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [walletDetails?.cardinal, dispatch]);

  /**
   * Verify a message signature
   */
  const verifyMessage = useCallback(async (
    message: string, 
    signature: string, 
    address: string
  ): Promise<boolean> => {
    try {
      return Verifier.verifySignature(address, message, signature);
    } catch (err) {
      console.error("Signature verification failed:", err);
      return false;
    }
  }, []);

  /**
   * Sign a transaction
   */
  const signTransaction = useCallback(async (options: SignTransactionOptions): Promise<string> => {
    if (!walletDetails?.cardinal) {
      throwBWAError(
        BWAErrorCode.WALLET_NOT_CONNECTED,
        "No wallet is currently connected for transaction signing",
        {
          severity: BWAErrorSeverity.HIGH,
          context: { 
            operation: 'transaction_signing',
            additionalData: { walletType: options.wallet }
          }
        }
      );
    }

    setIsLoading(true);
    setError(null);

    try {
      let txId = "";

      switch (options.wallet.toLowerCase()) {
        case "unisat":
          txId = await signTransactionUnisat(options);
          break;
        case "leather":
          txId = await signTransactionLeather(options);
          break;
        case "xverse":
          txId = await signTransactionXverse(options);
          break;
        case "phantom":
          txId = await signTransactionPhantom(options);
          break;
        case "okx":
          txId = await signTransactionOKX(options);
          break;
        default:
          throwBWAError(
            BWAErrorCode.VALIDATION_ERROR,
            `Transaction signing is not supported for ${options.wallet} wallet`,
            {
              severity: BWAErrorSeverity.HIGH,
              context: { 
                operation: 'transaction_signing',
                additionalData: { 
                  walletType: options.wallet,
                  supportedWallets: ['unisat', 'leather', 'xverse', 'phantom', 'okx']
                }
              }
            }
          );
      }

      dispatch(addNotification({
        id: Date.now(),
        message: `Transaction signed successfully. TX ID: ${txId}`,
        open: true,
        severity: "success" as const,
      }));

      return txId;

    } catch (err) {
      const error = err instanceof Error ? err : new Error('Transaction signing failed');
      setError(error);
      
      dispatch(addNotification({
        id: Date.now(),
        message: `Failed to sign transaction: ${error.message}`,
        open: true,
        severity: "error" as const,
      }));
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [walletDetails?.cardinal, dispatch]);

  /**
   * Sign a PSBT (Partially Signed Bitcoin Transaction)
   */
  const signPSBT = useCallback(async (
    psbtHex: string, 
    options: { broadcast?: boolean } = {}
  ): Promise<string> => {
    if ( !walletDetails?.wallet) {
      throwBWAError(
        BWAErrorCode.WALLET_NOT_CONNECTED,
        "No wallet is currently connected for PSBT signing",
        {
          severity: BWAErrorSeverity.HIGH,
          context: { 
            operation: 'psbt_signing'
          }
        }
      );
    }

    setIsLoading(true);
    setError(null);

    try {
      let result = "";

      switch (walletDetails.wallet.toLowerCase()) {
        case "unisat":
          result = await signPSBTUnisat(psbtHex, options.broadcast);
          break;
        case "leather":
          result = await signPSBTLeather(psbtHex, options.broadcast);
          break;
        case "xverse":
          result = await signPSBTXverse(psbtHex, options.broadcast);
          break;
        default:
          throwBWAError(
            BWAErrorCode.VALIDATION_ERROR,
            `PSBT signing is not supported for ${walletDetails.wallet} wallet`,
            {
              severity: BWAErrorSeverity.HIGH,
              context: { 
                operation: 'psbt_signing',
                additionalData: { 
                  walletType: walletDetails.wallet,
                  supportedWallets: ['unisat', 'leather', 'xverse']
                }
              }
            }
          );
      }

      dispatch(addNotification({
        id: Date.now(),
        message: options.broadcast ? "PSBT signed and broadcast" : "PSBT signed successfully",
        open: true,
        severity: "success" as const,
      }));

      return result;

    } catch (err) {
      const error = err instanceof Error ? err : new Error('PSBT signing failed');
      setError(error);
      
      dispatch(addNotification({
        id: Date.now(),
        message: `Failed to sign PSBT: ${error.message}`,
        open: true,
        severity: "error" as const,
      }));
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [ walletDetails?.wallet, dispatch]);

  /**
   * Clear the stored signature
   */
  const clearSignature = useCallback(() => {
    dispatch(setSignature(""));
    setError(null);
  }, [dispatch]);

  // Wallet-specific message signing implementations
  const signMessageUnisat = async (options: SignMessageOptions): Promise<string> => {
    if (!window.unisat) {
      throwBWAError(
        BWAErrorCode.WALLET_NOT_FOUND,
        "Unisat wallet is not available or not installed",
        {
          severity: BWAErrorSeverity.HIGH,
          context: { 
            operation: 'message_signing',
            additionalData: { walletType: 'Unisat' }
          }
        }
      );
    }

    return await window.unisat.signMessage(options.message, "ecdsa");
  };

  const signMessageLeather = async (options: SignMessageOptions): Promise<string> => {
    if (!window.LeatherProvider) {
      throwBWAError(
        BWAErrorCode.WALLET_NOT_FOUND,
        "Leather wallet is not available or not installed",
        {
          severity: BWAErrorSeverity.HIGH,
          context: { 
            operation: 'message_signing',
            additionalData: { walletType: 'Leather' }
          }
        }
      );
    }

    const response = await window.LeatherProvider.request("signMessage", {
      message: options.message,
      paymentType: "p2wpkh",
    });

    return response.result.signature;
  };

  const signMessageXverse = async (options: SignMessageOptions): Promise<string> => {
    const signMessageOptions = {
      payload: {
        network: {
          type: options.network === "mainnet" 
            ? BitcoinNetworkType.Mainnet 
            : BitcoinNetworkType.Testnet,
        },
        address: options.address,
        message: options.message,
      },
      onFinish: (response: any) => response,
      onCancel: () => {
        throwBWAError(
          BWAErrorCode.USER_REJECTED,
          "User canceled message signing",
          {
            severity: BWAErrorSeverity.MEDIUM,
            context: { 
              operation: 'message_signing',
              additionalData: { walletType: 'Xverse' }
            }
          }
        );
      },
    };

    return new Promise((resolve, reject) => {
      signMessageOptions.onFinish = (response: any) => {
        resolve(response);
      };
      signMessageOptions.onCancel = (() => {
        reject(new Error("User canceled message signing"));
      }) as () => never;
      
      signMessageSatsConnect(signMessageOptions);
    });
  };

  const signMessagePhantom = async (options: SignMessageOptions): Promise<string> => {
    if (!window.phantom?.bitcoin) {
      throwBWAError(
        BWAErrorCode.WALLET_NOT_FOUND,
        "Phantom wallet is not available for message signing",
        {
          severity: BWAErrorSeverity.HIGH,
          context: { 
            operation: 'message_signing',
            additionalData: { walletType: 'Phantom' }
          }
        }
      );
    }

    const response = await window.phantom.bitcoin.signMessage(
      options.address,
      options.message
    );

    return response.signature;
  };

  const signMessageOKX = async (options: SignMessageOptions): Promise<string> => {
    if (!window.okxwallet?.bitcoin) {
      throwBWAError(
        BWAErrorCode.WALLET_NOT_FOUND,
        "OKX wallet is not available for message signing",
        {
          severity: BWAErrorSeverity.HIGH,
          context: { 
            operation: 'message_signing',
            additionalData: { walletType: 'OKX' }
          }
        }
      );
    }

    const response = await window.okxwallet.bitcoin.signMessage(
      options.message,
      "ecdsa"
    );

    return response;
  };

  const signMessageMagicEden = async (options: SignMessageOptions): Promise<string> => {
    const meWallet = testWallets.find((wallet: WalletWithFeatures<any>) =>
      wallet.name.includes("Magic Eden")
    );

    if (!meWallet) {
      throwBWAError(
        BWAErrorCode.WALLET_NOT_FOUND,
        "Magic Eden wallet is not available for message signing",
        {
          severity: BWAErrorSeverity.HIGH,
          context: { 
            operation: 'message_signing',
            additionalData: { walletType: 'Magic Eden' }
          }
        }
      );
    }

    // Magic Eden wallet signing implementation would go here
    throwBWAError(
      BWAErrorCode.MESSAGE_SIGNING_FAILED,
      "Magic Eden message signing feature is not yet implemented",
      {
        severity: BWAErrorSeverity.MEDIUM,
        context: { 
          operation: 'message_signing',
          additionalData: { 
            walletType: 'Magic Eden',
            reason: 'feature_not_implemented'
          }
        }
      }
    );
  };

  // Transaction signing implementations (simplified - would need full implementation)
  const signTransactionUnisat = async (options: SignTransactionOptions): Promise<string> => {
    if (!window.unisat) {
      throwBWAError(
        BWAErrorCode.WALLET_NOT_FOUND,
        "Unisat wallet is not available for transaction signing",
        {
          severity: BWAErrorSeverity.HIGH,
          context: { 
            operation: 'transaction_signing',
            additionalData: { walletType: 'Unisat' }
          }
        }
      );
    }

    // This would need proper transaction construction
    throwBWAError(
      BWAErrorCode.TRANSACTION_SIGNING_FAILED,
      "Unisat transaction signing feature is not yet implemented",
      {
        severity: BWAErrorSeverity.MEDIUM,
        context: { 
          operation: 'transaction_signing',
          additionalData: { 
            walletType: 'Unisat',
            reason: 'feature_not_implemented'
          }
        }
      }
    );
  };

  const signTransactionLeather = async (options: SignTransactionOptions): Promise<string> => {
    if (!window.LeatherProvider) {
      throwBWAError(
        BWAErrorCode.WALLET_NOT_FOUND,
        "Leather wallet is not available for transaction signing",
        {
          severity: BWAErrorSeverity.HIGH,
          context: { 
            operation: 'transaction_signing',
            additionalData: { walletType: 'Leather' }
          }
        }
      );
    }

    // This would need proper transaction construction
    throwBWAError(
      BWAErrorCode.TRANSACTION_SIGNING_FAILED,
      "Leather transaction signing feature is not yet implemented",
      {
        severity: BWAErrorSeverity.MEDIUM,
        context: { 
          operation: 'transaction_signing',
          additionalData: { 
            walletType: 'Leather',
            reason: 'feature_not_implemented'
          }
        }
      }
    );
  };

  const signTransactionXverse = async (options: SignTransactionOptions): Promise<string> => {
    // This would need proper sats-connect transaction signing
    throwBWAError(
      BWAErrorCode.TRANSACTION_SIGNING_FAILED,
      "Xverse transaction signing feature is not yet implemented",
      {
        severity: BWAErrorSeverity.MEDIUM,
        context: { 
          operation: 'transaction_signing',
          additionalData: { 
            walletType: 'Xverse',
            reason: 'feature_not_implemented'
          }
        }
      }
    );
  };

  const signTransactionPhantom = async (options: SignTransactionOptions): Promise<string> => {
    if (!window.phantom?.bitcoin) {
      throwBWAError(
        BWAErrorCode.WALLET_NOT_FOUND,
        "Phantom wallet is not available for transaction signing",
        {
          severity: BWAErrorSeverity.HIGH,
          context: { 
            operation: 'transaction_signing',
            additionalData: { walletType: 'Phantom' }
          }
        }
      );
    }

    // This would need proper transaction construction
    throwBWAError(
      BWAErrorCode.TRANSACTION_SIGNING_FAILED,
      "Phantom transaction signing feature is not yet implemented",
      {
        severity: BWAErrorSeverity.MEDIUM,
        context: { 
          operation: 'transaction_signing',
          additionalData: { 
            walletType: 'Phantom',
            reason: 'feature_not_implemented'
          }
        }
      }
    );
  };

  const signTransactionOKX = async (options: SignTransactionOptions): Promise<string> => {
    if (!window.okxwallet?.bitcoin) {
      throwBWAError(
        BWAErrorCode.WALLET_NOT_FOUND,
        "OKX wallet is not available or not installed",
        {
          severity: BWAErrorSeverity.HIGH,
          context: { 
            operation: 'transaction_signing',
            additionalData: { walletType: 'OKX' }
          }
        }
      );
    }

    // This would need proper transaction construction
    throwBWAError(
      BWAErrorCode.VALIDATION_ERROR,
      "Transaction signing implementation is not yet available for OKX wallet",
      {
        severity: BWAErrorSeverity.MEDIUM,
        context: { 
          operation: 'transaction_signing',
          additionalData: { 
            walletType: 'OKX',
            reason: 'feature_not_implemented'
          }
        }
      }
    );
  };

  // PSBT signing implementations (simplified - would need full implementation)
  const signPSBTUnisat = async (psbtHex: string, broadcast?: boolean): Promise<string> => {
    if (!window.unisat) {
      throwBWAError(
        BWAErrorCode.WALLET_NOT_FOUND,
        "Unisat wallet is not available or not installed",
        {
          severity: BWAErrorSeverity.HIGH,
          context: { 
            operation: 'psbt_signing',
            additionalData: { walletType: 'Unisat' }
          }
        }
      );
    }

    const signedPSBT = await window.unisat.signPsbt(psbtHex);
    
    if (broadcast) {
      return await window.unisat.pushPsbt(signedPSBT);
    }
    
    return signedPSBT;
  };

  const signPSBTLeather = async (psbtHex: string, broadcast?: boolean): Promise<string> => {
    if (!window.LeatherProvider) {
      throwBWAError(
        BWAErrorCode.WALLET_NOT_FOUND,
        "Leather wallet is not available or not installed",
        {
          severity: BWAErrorSeverity.HIGH,
          context: { 
            operation: 'psbt_signing',
            additionalData: { walletType: 'Leather' }
          }
        }
      );
    }

    const response = await window.LeatherProvider.request("signPsbt", {
      hex: psbtHex,
      allowedSighash: [0x01, 0x02, 0x03, 0x81, 0x82, 0x83],
    });

    if (broadcast) {
      // Would need to broadcast the signed PSBT
      throwBWAError(
        BWAErrorCode.VALIDATION_ERROR,
        "PSBT broadcasting is not yet implemented for Leather wallet",
        {
          severity: BWAErrorSeverity.MEDIUM,
          context: { 
            operation: 'psbt_broadcasting',
            additionalData: { 
              walletType: 'Leather',
              reason: 'feature_not_implemented'
            }
          }
        }
      );
    }

    return response.result.hex;
  };

  const signPSBTXverse = async (psbtHex: string, broadcast?: boolean): Promise<string> => {
    // This would need proper sats-connect PSBT signing implementation
    throwBWAError(
      BWAErrorCode.VALIDATION_ERROR,
      "PSBT signing implementation is not yet available for Xverse wallet",
      {
        severity: BWAErrorSeverity.MEDIUM,
        context: { 
          operation: 'psbt_signing',
          additionalData: { 
            walletType: 'Xverse',
            reason: 'feature_not_implemented'
          }
        }
      }
    );
  };

  return {
    // Signing State
    isLoading,
    error,
    lastSignature: signature,
    
    // Message Signing
    signMessage,
    verifyMessage,
    
    // Transaction Signing
    signTransaction,
    
    // PSBT Signing
    signPSBT,
    
    // Utilities
    clearSignature,
  };
};
