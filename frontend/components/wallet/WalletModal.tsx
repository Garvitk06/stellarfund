"use client";

import { SupportedWallet } from "@creit-tech/stellar-wallets-kit";
import { X, Wallet } from "lucide-react";
import { useEffect, useState } from "react";

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (wallet: SupportedWallet) => Promise<void>;
}

const WALLETS = [
  { id: SupportedWallet.FREIGHTER, name: "Freighter", icon: "🚀" },
  { id: SupportedWallet.XBULL, name: "xBull", icon: "🐂" },
  { id: SupportedWallet.ALBEDO, name: "Albedo", icon: "🌟" },
  { id: SupportedWallet.LOBSTR, name: "Lobstr", icon: "🦞" },
  { id: SupportedWallet.HANA, name: "Hana", icon: "🌸" },
];

export function WalletModal({ isOpen, onClose, onConnect }: WalletModalProps) {
  const [loading, setLoading] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleConnect = async (walletId: SupportedWallet) => {
    setLoading(walletId);
    try {
      await onConnect(walletId);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="glass w-full max-w-md rounded-3xl overflow-hidden shadow-2xl transition-all scale-100 animate-in fade-in zoom-in duration-300">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/20 rounded-xl">
              <Wallet className="w-6 h-6 text-indigo-400" />
            </div>
            <h2 className="text-xl font-bold text-white">Connect Wallet</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-3">
          {WALLETS.map((wallet) => (
            <button
              key={wallet.id}
              onClick={() => handleConnect(wallet.id)}
              disabled={!!loading}
              className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-indigo-500/50 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl">{wallet.icon}</span>
                <span className="font-semibold text-lg text-slate-200 group-hover:text-white transition-colors">
                  {wallet.name}
                </span>
              </div>
              {loading === wallet.id ? (
                <div className="w-5 h-5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <div className="w-2 h-2 rounded-full bg-slate-600 group-hover:bg-indigo-400 transition-colors" />
              )}
            </button>
          ))}
        </div>

        <div className="p-6 bg-white/5 text-center text-sm text-slate-400">
          New to Stellar? <a href="#" className="text-indigo-400 hover:underline">Learn about wallets</a>
        </div>
      </div>
    </div>
  );
}
