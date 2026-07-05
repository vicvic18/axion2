import { useMemo, useCallback, useState } from "react";
import { BrowserProvider, Contract, formatEther, parseEther } from "ethers";
import { useWallet } from "../context/WalletContext";
import {
  ABI,
  CONTRACT_ADDRESS,
  ACTIVE_NETWORK,
  formatBNB,
  parseBNB,
  getReferralLink,
} from "../contracts/contract";

export interface StakeData {
  id: number;
  principal: string;       // in BNB
  periodSeconds: number;
  dailyRate: number;       // in basis points (130 = 1.3%)
  startTime: number;       // unix timestamp
  endTime: number;         // unix timestamp
  reward: string;          // in BNB
  claimed: boolean;
  unstaked: boolean;
  status: "locked" | "claimable" | "claimed";
  progress: number;        // 0-100
}

export interface DashboardData {
  walletBalance: string;   // in BNB
  totalDelegated: string;  // in BNB
  totalUndelegating: string;
  totalReadyToClaim: string;
  totalRewardReady: string;
  totalClaimed: string;
}

export interface ReferralData {
  referrer: string;
  l1Referrer: string;
  l2Referrer: string;
  l1Count: number;
  l2Count: number;
  commissionBalance: string;     // in BNB
  totalCommissionEarned: string; // in BNB
}

export function useContract() {
  const { address, isConnected } = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Create ethers provider & contract instance
  const contract = useMemo(() => {
    if (typeof window === "undefined") return null;
    if (!CONTRACT_ADDRESS) return null;
    const eth = (window as any).ethereum;
    if (!eth) return null;

    try {
      const provider = new BrowserProvider(eth);
      // For read-only calls we don't need signer
      return new Contract(CONTRACT_ADDRESS, ABI, provider);
    } catch {
      return null;
    }
  }, []);

  // Create a signer-enabled contract instance for writes
  const signedContract = useMemo(() => {
    if (!contract || !isConnected) return null;

    const getSigned = async () => {
      const eth = (window as any).ethereum;
      if (!eth) return null;
      const provider = new BrowserProvider(eth);
      const signer = await provider.getSigner();
      return new Contract(CONTRACT_ADDRESS, ABI, signer);
    };
    return getSigned;
  }, [contract, isConnected]);

  // ============ Read Functions ============

  /** Get user's dashboard data */
  const getDashboard = useCallback(async (): Promise<DashboardData | null> => {
    if (!contract || !address) return null;
    setLoading(true);
    setError(null);
    try {
      const d = await contract.getDashboard(address);
      return {
        walletBalance: formatEther(d.walletBalance),
        totalDelegated: formatEther(d.totalDelegated),
        totalUndelegating: formatEther(d.totalUndelegating),
        totalReadyToClaim: formatEther(d.totalReadyToClaim),
        totalRewardReady: formatEther(d.totalRewardReady),
        totalClaimed: formatEther(d.totalClaimed),
      };
    } catch (err: any) {
      setError(err.message || "Failed to fetch dashboard");
      return null;
    } finally {
      setLoading(false);
    }
  }, [contract, address]);

  /** Get all stakes for the user */
  const getUserStakes = useCallback(async (): Promise<StakeData[]> => {
    if (!contract || !address) return [];
    setLoading(true);
    setError(null);
    try {
      const ids: bigint[] = await contract.getUserStakeIds(address);
      const stakes: StakeData[] = [];

      for (const id of ids) {
        const s = await contract.getStake(address, id);
        const now = Math.floor(Date.now() / 1000);
        const isClaimable = !s.claimed && now >= Number(s.endTime);
        const totalPeriod = Number(s.endTime) - Number(s.startTime);
        const elapsed = Math.min(now - Number(s.startTime), totalPeriod);
        const progress = totalPeriod > 0 ? Math.min(100, Math.max(0, (elapsed / totalPeriod) * 100)) : 0;

        stakes.push({
          id: Number(s.id),
          principal: formatEther(s.principal),
          periodSeconds: Number(s.periodSeconds),
          dailyRate: Number(s.dailyRate),
          startTime: Number(s.startTime),
          endTime: Number(s.endTime),
          reward: formatEther(s.reward),
          claimed: s.claimed,
          unstaked: s.unstaked,
          status: s.claimed ? "claimed" : isClaimable ? "claimable" : "locked",
          progress: Math.round(progress),
        });
      }
      // Newest first
      return stakes.reverse();
    } catch (err: any) {
      setError(err.message || "Failed to fetch stakes");
      return [];
    } finally {
      setLoading(false);
    }
  }, [contract, address]);

  /** Get referral info */
  const getReferralInfo = useCallback(async (): Promise<ReferralData | null> => {
    if (!contract || !address) return null;
    setLoading(true);
    setError(null);
    try {
      const info = await contract.getReferralInfo(address);
      return {
        referrer: info.referrer,
        l1Referrer: info.l1Referrer,
        l2Referrer: info.l2Referrer,
        l1Count: Number(info.l1Count),
        l2Count: Number(info.l2Count),
        commissionBalance: formatEther(info.commissionBalance),
        totalCommissionEarned: formatEther(info.totalCommissionEarned),
      };
    } catch (err: any) {
      setError(err.message || "Failed to fetch referral info");
      return null;
    } finally {
      setLoading(false);
    }
  }, [contract, address]);

  /** Calculate reward preview (pure function) */
  const calculateRewardPreview = useCallback(
    async (amountBNB: string, periodSeconds: number): Promise<string> => {
      if (!contract) return "0";
      try {
        const dailyRate = await contract.DAILY_RATE_SHORT();
        const longRate = await contract.DAILY_RATE_LONG();
        const threshold = await contract.ONE_DAY_SECONDS();
        const rate = periodSeconds <= threshold ? dailyRate : longRate;
        const reward = await contract.calculateReward(parseEther(amountBNB), rate, periodSeconds);
        return formatEther(reward);
      } catch {
        return "0";
      }
    },
    [contract]
  );

  // ============ Write Functions ============

  /** Stake BNB for a given period */
  const stake = useCallback(
    async (amountBNB: string, periodSeconds: number, referrer?: string): Promise<boolean> => {
      if (!signedContract) return false;
      setLoading(true);
      setError(null);
      try {
        const c = await signedContract();
        if (!c) return false;

        const value = parseEther(amountBNB);
        const ref = referrer || "0x0000000000000000000000000000000000000000";

        const tx = await c.stake(periodSeconds, ref, { value });
        await tx.wait();
        return true;
      } catch (err: any) {
        const msg = err?.error?.message || err?.message || "Stake failed";
        // Clean up revert messages
        const revertMatch = msg.match(/revert(?:ed with reason string)?\s*"?([^"]*)"?/i);
        setError(revertMatch?.[1] || msg);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [signedContract]
  );

  /** Claim a specific stake */
  const claim = useCallback(
    async (stakeId: number): Promise<boolean> => {
      if (!signedContract) return false;
      setLoading(true);
      setError(null);
      try {
        const c = await signedContract();
        if (!c) return false;
        const tx = await c.claim(stakeId);
        await tx.wait();
        return true;
      } catch (err: any) {
        const msg = err?.error?.message || err?.message || "Claim failed";
        const revertMatch = msg.match(/revert(?:ed with reason string)?\s*"?([^"]*)"?/i);
        setError(revertMatch?.[1] || msg);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [signedContract]
  );

  /** Claim all available stakes */
  const claimAll = useCallback(async (): Promise<boolean> => {
    if (!signedContract) return false;
    setLoading(true);
    setError(null);
    try {
      const c = await signedContract();
      if (!c) return false;
      const tx = await c.claimAll();
      await tx.wait();
      return true;
    } catch (err: any) {
      const msg = err?.error?.message || err?.message || "Claim All failed";
      const revertMatch = msg.match(/revert(?:ed with reason string)?\s*"?([^"]*)"?/i);
      setError(revertMatch?.[1] || msg);
      return false;
    } finally {
      setLoading(false);
    }
  }, [signedContract]);

  /** Claim referral commissions */
  const claimCommission = useCallback(async (): Promise<boolean> => {
    if (!signedContract) return false;
    setLoading(true);
    setError(null);
    try {
      const c = await signedContract();
      if (!c) return false;
      const tx = await c.claimCommission();
      await tx.wait();
      return true;
    } catch (err: any) {
      const msg = err?.error?.message || err?.message || "Claim commission failed";
      const revertMatch = msg.match(/revert(?:ed with reason string)?\s*"?([^"]*)"?/i);
      setError(revertMatch?.[1] || msg);
      return false;
    } finally {
      setLoading(false);
    }
  }, [signedContract]);

  return {
    contract,
    loading,
    error,
    setError,
    isReady: !!contract && isConnected && !!CONTRACT_ADDRESS,
    contractAddress: CONTRACT_ADDRESS,
    network: ACTIVE_NETWORK,
    // reads
    getDashboard,
    getUserStakes,
    getReferralInfo,
    calculateRewardPreview,
    // writes
    stake,
    claim,
    claimAll,
    claimCommission,
    // helpers
    formatBNB,
    parseBNB,
    getReferralLink,
  };
}
