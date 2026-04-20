"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  StellarWalletsKit, 
  WalletNetwork, 
  SupportedWallet,
} from "@creit-tech/stellar-wallets-kit";

const STORAGE_KEY = "stellar_wallet_connected";

export function useWallet() {
  const [address, setAddress] = useState<string | null>(null);
  const [wallet, setWallet] = useState<SupportedWallet | null>(null);
  const [kit, setKit] = useState<StellarWalletsKit | null>(null);

  useEffect(() => {
    // Only initialize on client
    if (typeof window !== "undefined") {
      const swk = new StellarWalletsKit({
        network: WalletNetwork.TESTNET,
        selectedWallet: SupportedWallet.FREIGHTER,
        modules: [
          // Modules will be imported dynamically or set here
        ]
      });
      setKit(swk);

      const savedWallet = localStorage.getItem(STORAGE_KEY);
      if (savedWallet) {
        // Attempt to reconnect if needed
      }
    }
  }, []);

  const connect = useCallback(async (walletType: SupportedWallet) => {
    if (!kit) return;
    try {
      kit.setWallet(walletType);
      const { address } = await kit.getAddress();
      setAddress(address);
      setWallet(walletType);
      localStorage.setItem(STORAGE_KEY, walletType);
      return address;
    } catch (error) {
      console.error("Connection failed", error);
      throw error;
    }
  }, [kit]);

  const disconnect = useCallback(() => {
    setAddress(null);
    setWallet(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const signTx = useCallback(async (xdr: string) => {
    if (!kit || !address) throw new Error("Wallet not connected");
    return await kit.signTransaction(xdr, {
      network: WalletNetwork.TESTNET,
      address: address
    });
  }, [kit, address]);

  return {
    address,
    wallet,
    connect,
    disconnect,
    signTx,
    kit
  };
}
