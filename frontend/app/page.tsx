"use client";

import { useEffect, useState } from "react";
import { useWallet } from "../hooks/useWallet";
import { useTransaction } from "../hooks/useTransaction";
import { useContractEvents } from "../hooks/useContractEvents";
import { getCounterValue, incrementCounter } from "../lib/contract";
import { WalletModal } from "../components/wallet/WalletModal";
import { ActivityFeed } from "../components/ActivityFeed";
import { 
  Plus, 
  ExternalLink, 
  Copy, 
  Power, 
  ShieldCheck,
  TrendingUp,
  Cpu
} from "lucide-react";
import { toast } from "sonner";

export default function Home() {
  const { address, connect, disconnect, signTx } = useWallet();
  const { status, txHash, explorerLink, track } = useTransaction();
  const events = useContractEvents();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [counter, setCounter] = useState<number | null>(null);

  // Sync counter value
  useEffect(() => {
    const fetchCounter = async () => {
      const val = await getCounterValue();
      setCounter(val);
    };
    fetchCounter();
    const interval = setInterval(fetchCounter, 10000); // refresh every 10s
    return () => clearInterval(interval);
  }, []);

  const handleIncrement = async () => {
    if (!address) {
      setIsModalOpen(true);
      return;
    }
    try {
      await track(() => incrementCounter(address, signTx));
      // Refresh counter immediately after success
      const newVal = await getCounterValue();
      setCounter(newVal);
    } catch (err) {
      console.error("Increment error", err);
    }
  };

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      toast.success("Address copied to clipboard");
    }
  };

  const truncateAddress = (addr: string) => 
    `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  return (
    <main className="min-h-screen p-4 md:p-8 lg:p-12 flex flex-col items-center">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-500/20 blur-[120px] rounded-full" />
      </div>

      {/* Navbar */}
      <nav className="w-full max-w-6xl flex justify-between items-center mb-16 glass p-4 px-6 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-indigo-500 to-pink-500 rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
            S
          </div>
          <span className="text-xl font-bold tracking-tight text-white">Stellar<span className="text-indigo-400">DApp</span></span>
        </div>

        <div>
          {address ? (
            <div className="flex items-center gap-2">
              <button 
                onClick={copyAddress}
                className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/5 text-slate-200 text-sm"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {truncateAddress(address)}
                <Copy className="w-4 h-4 text-slate-400" />
              </button>
              <button 
                onClick={disconnect}
                className="p-2 bg-pink-500/10 hover:bg-pink-500/20 text-pink-400 rounded-xl transition-all border border-pink-500/20"
                title="Disconnect"
              >
                <Power className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-500/25 active:scale-95"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </nav>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Interaction Area */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          <div className="glass p-8 md:p-12 rounded-[40px] flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8">
              <Cpu className="w-12 h-12 text-white/5" />
            </div>
            
            <div className="text-indigo-400 font-medium tracking-widest uppercase text-sm mb-4">
              Soroban Smart Contract
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-12">
              Stellar Counter
            </h1>

            <div className="relative mb-12 group">
              <div className="absolute inset-0 bg-indigo-500/30 blur-[60px] rounded-full scale-150 transition-transform group-hover:scale-[1.7] duration-700" />
              <div className="relative w-48 h-48 rounded-[60px] bg-white/5 border border-white/10 flex flex-col items-center justify-center overflow-hidden">
                <span className="text-sm font-bold text-slate-500 mb-1 uppercase tracking-tighter">Current Count</span>
                <span className="text-7xl font-black text-white">
                  {counter !== null ? counter : "..."}
                </span>
              </div>
            </div>

            <button 
              onClick={handleIncrement}
              disabled={status !== "idle" && status !== "success" && status !== "failed"}
              className="relative group px-12 py-5 rounded-3xl overflow-hidden shadow-2xl transition-all hover:scale-105 active:scale-95 disabled:scale-100 disabled:opacity-50"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-pink-600 group-hover:opacity-100 transition-opacity" />
              <span className="relative flex items-center justify-center gap-3 text-lg font-bold text-white">
                {status !== "idle" && status !== "success" && status !== "failed" ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {status.charAt(0).toUpperCase() + status.slice(1)}...
                  </>
                ) : (
                  <>
                    <Plus className="w-6 h-6" />
                    Increment Now
                  </>
                )}
              </span>
            </button>

            {txHash && (
              <a 
                href={explorerLink!} 
                target="_blank" 
                rel="noopener noreferrer"
                className="mt-8 flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors bg-indigo-400/10 px-4 py-2 rounded-full border border-indigo-400/20"
              >
                View on Stellar Expert
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass p-6 rounded-3xl flex items-center gap-4">
              <div className="p-3 bg-emerald-500/20 rounded-2xl">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-slate-400 text-xs uppercase font-bold tracking-tight">Security</p>
                <p className="text-white font-medium">Soroban Verified</p>
              </div>
            </div>
            <div className="glass p-6 rounded-3xl flex items-center gap-4">
              <div className="p-3 bg-indigo-500/20 rounded-2xl">
                <TrendingUp className="w-6 h-6 text-indigo-400" />
              </div>
              <div>
                <p className="text-slate-400 text-xs uppercase font-bold tracking-tight">Latency</p>
                <p className="text-white font-medium">~5s Finality</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          <ActivityFeed events={events} />
          
          <div className="glass p-6 rounded-3xl">
            <h4 className="text-white font-bold mb-4">Quick Stats</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Network</span>
                <span className="text-emerald-400 text-xs font-bold bg-emerald-400/10 px-2 py-0.5 rounded uppercase">Testnet</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Asset</span>
                <span className="text-white text-sm font-medium">Native (XLM)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Update Speed</span>
                <span className="text-white text-sm font-medium">5000ms</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <WalletModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onConnect={connect}
      />
      
      <footer className="mt-20 text-slate-500 text-sm pb-8">
        Built with Soroban & Next.js 14 • Powered by Stellar
      </footer>
    </main>
  );
}
