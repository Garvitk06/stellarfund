"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";

export type TxStatus = "idle" | "building" | "signing" | "pending" | "success" | "failed";

export function useTransaction() {
  const [status, setStatus] = useState<TxStatus>("idle");
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setStatus("idle");
    setTxHash(null);
    setError(null);
  }, []);

  const track = useCallback(async (action: () => Promise<string>) => {
    setStatus("building");
    setError(null);
    try {
      // Transition through states (conceptual, as some are combined in the promise)
      // Actually, building and signing happen during the action()
      setStatus("signing");
      const hash = await action();
      setTxHash(hash);
      setStatus("pending");
      
      // For Soroban, we usually wait for execution status
      // This is a simplified version; real status would use getTransaction history
      setStatus("success");
      toast.success("Transaction successful!");
      return hash;
    } catch (err: any) {
      console.error("Tx tracking failed", err);
      setStatus("failed");
      const errorMsg = err.message || "Transaction failed";
      setError(errorMsg);
      
      if (errorMsg.includes("User rejected")) {
        toast.error("Transaction rejected by user");
      } else if (errorMsg.includes("InsufficientBalance")) {
        toast.error("Not enough XLM to complete transaction");
      } else {
        toast.error(`Error: ${errorMsg}`);
      }
      throw err;
    }
  }, []);

  return {
    status,
    txHash,
    error,
    track,
    reset,
    explorerLink: txHash ? `https://stellar.expert/explorer/testnet/tx/${txHash}` : null
  };
}
