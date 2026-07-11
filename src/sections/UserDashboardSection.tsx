import { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router";
import { useWallet } from "../context/WalletContext";
import { useContract } from "../hooks/useContract";
import type { StakeData, DashboardData, ReferralData } from "../hooks/useContract";
import {
  Wallet,
  Lock,
  Gift,
  CheckCircle2,
  Layers,
  Copy,
  Check,
  Users,
  Coins,
  AlertCircle,
  RefreshCw,
  Inbox,
  ArrowRight,
  BookOpen,
  Clock,
} from "lucide-react";

// Claim preview always shows full return (principal + reward) for simple UX

function formatDate(ts: number): string {
  return new Date(ts * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// Empty state component
function EmptyState({ icon, title, description, action }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center py-10 text-center">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-axion-bg-secondary">
        {icon}
      </div>
      <p className="mb-1 text-sm font-medium text-axion-text-secondary">{title}</p>
      <p className="mb-3 max-w-xs text-xs text-axion-text-muted">{description}</p>
      {action}
    </div>
  );
}

// Zero-value dashboard (no mock data)
const emptyDashboard: DashboardData = {
  walletBalance: "0",
  totalDelegated: "0",
  totalUndelegating: "0",
  totalReadyToClaim: "0",
  totalRewardReady: "0",
  totalClaimed: "0",
};

const emptyReferral: ReferralData = {
  referrer: "0x0000000000000000000000000000000000000000",
  l1Referrer: "0x0000000000000000000000000000000000000000",
  l2Referrer: "0x0000000000000000000000000000000000000000",
  l1Count: 0,
  l2Count: 0,
  commissionBalance: "0",
  totalCommissionEarned: "0",
};

export default function UserDashboardSection() {
  const { isConnected, address, isWrongNetwork, switchNetwork } = useWallet();
  const {
    isReady,
    error,
    setError,
    getDashboard,
    getUserStakes,
    getReferralInfo,
    claim,
    claimAll,
    claimCommission,
    getReferralLink,
    contract,
  } = useContract();

  const useReal = isConnected && isReady;

  // Data states - start empty (no mock data)
  const [dashboard, setDashboard] = useState<DashboardData>(emptyDashboard);
  const [stakes, setStakes] = useState<StakeData[]>([]);
  const [referral, setReferral] = useState<ReferralData>(emptyReferral);
  const [referralLink, setReferralLink] = useState("");
  const [referralUnlocked, setReferralUnlocked] = useState(false); // >= 0.01 BNB staked

  // UI states
  const [claiming, setClaiming] = useState<number | null>(null);
  const [claimingAll, setClaimingAll] = useState(false);
  const [commissionClaiming, setCommissionClaiming] = useState(false);
  const [copied, setCopied] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [largeClaimNotice, setLargeClaimNotice] = useState<string | null>(null); // > 0.29 BNB claim notice

  // Fetch data from contract
  const fetchData = useCallback(async () => {
    if (!useReal) return;
    setRefreshing(true);
    setError(null);

    try {
      const [d, s, r] = await Promise.all([
        getDashboard(),
        getUserStakes(),
        getReferralInfo(),
      ]);
      if (d) setDashboard(d);
      setStakes(s); // allow empty array
      if (r) setReferral(r);

      // Check referral eligibility: userTotalStakedAmount >= 0.01 BNB
      if (contract && address) {
        try {
          const lifetimeStaked = await contract.userTotalStakedAmount(address);
          setReferralUnlocked(lifetimeStaked >= BigInt("10000000000000000")); // 0.01 BNB in wei
        } catch {
          setReferralUnlocked(false);
        }
      }
    } catch (err: any) {
      console.error("Fetch error:", err);
    } finally {
      setRefreshing(false);
    }
  }, [useReal, getDashboard, getUserStakes, getReferralInfo, setError]);

  // Initial fetch + polling
  useEffect(() => {
    if (!useReal) {
      setStakes([]);
      setDashboard(emptyDashboard);
      setReferral(emptyReferral);
      return;
    }
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [useReal, fetchData]);

  // Update referral link when address changes
  useEffect(() => {
    if (address) {
      setReferralLink(getReferralLink(address));
    } else {
      setReferralLink("");
    }
  }, [address, getReferralLink]);

  // Summary derived from actual data only
  const summary = useMemo(() => {
    const claimableCount = stakes.filter((s) => s.status === "claimable").length;
    const totalReady = stakes
      .filter((s) => s.status === "claimable")
      .reduce((sum, s) => sum + parseFloat(s.principal) + parseFloat(s.reward), 0);
    const totalReward = stakes
      .filter((s) => s.status === "claimable")
      .reduce((sum, s) => sum + parseFloat(s.reward), 0);
    // Frontend-calculated totalClaimed = principal + reward for all claimed stakes
    const totalClaimed = stakes
      .filter((s) => s.status === "claimed")
      .reduce((sum, s) => sum + parseFloat(s.principal) + parseFloat(s.reward), 0);
    return {
      walletBalance: parseFloat(dashboard.walletBalance),
      totalDelegated: parseFloat(dashboard.totalDelegated),
      totalReady,
      totalReward,
      totalClaimed,
      claimableCount,
    };
  }, [dashboard, stakes]);

  // Handlers
  const handleClaim = async (stakeId: number) => {
    if (!useReal) return;
    if (isWrongNetwork) { await switchNetwork(); return; }
    setClaiming(stakeId);
    setError(null);
    setLargeClaimNotice(null);

    // Check if this is a large stake (> 0.29 BNB) before claiming
    const targetStake = stakes.find((s) => s.id === stakeId);
    const isLarge = targetStake && parseFloat(targetStake.principal) > 0.29;

    const success = await claim(stakeId);
    if (success) {
      await fetchData();
      if (isLarge) {
        setLargeClaimNotice("Your principal will be returned to your wallet within a few hours as it needs to interact with the BNB Chain validator system.");
        setTimeout(() => setLargeClaimNotice(null), 8000);
      }
    }
    setClaiming(null);
  };

  const handleClaimAll = async () => {
    if (!useReal) return;
    if (isWrongNetwork) { await switchNetwork(); return; }
    setClaimingAll(true);
    setError(null);
    setLargeClaimNotice(null);

    // Check if any claimable stake is large (> 0.29 BNB)
    const hasLargeStake = stakes.some(
      (s) => s.status === "claimable" && parseFloat(s.principal) > 0.29
    );

    const success = await claimAll();
    if (success) {
      await fetchData();
      if (hasLargeStake) {
        setLargeClaimNotice("Your principal will be returned to your wallet within a few hours as it needs to interact with the BNB Chain validator system.");
        setTimeout(() => setLargeClaimNotice(null), 8000);
      }
    }
    setClaimingAll(false);
  };

  const handleClaimCommission = async () => {
    if (!useReal) return;
    if (isWrongNetwork) { await switchNetwork(); return; }
    setCommissionClaiming(true);
    setError(null);
    const success = await claimCommission();
    if (success) await fetchData();
    setCommissionClaiming(false);
  };

  const handleCopy = async () => {
    if (!referralLink) return;
    try { await navigator.clipboard.writeText(referralLink); } catch {
      const ta = document.createElement("textarea"); ta.value = referralLink;
      document.body.appendChild(ta); ta.select(); document.execCommand("copy"); document.body.removeChild(ta);
    }
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  const getClaimPreview = (stake: StakeData) => {
    const amt = parseFloat(stake.principal);
    const rwd = parseFloat(stake.reward);
    return { label: `Receive ${(amt + rwd).toFixed(4)} BNB`, color: "text-axion-success" };
  };

  // Check if user has any referral activity
  const hasReferralActivity = referral.l1Count > 0 || referral.l2Count > 0 || parseFloat(referral.totalCommissionEarned) > 0;

  return (
    <section id="dashboard" className="bg-axion-bg-secondary py-16 md:py-20">
      <div className="mx-auto max-w-[1200px] px-6">
        {/* Header */}
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-semibold text-white md:text-3xl">My Dashboard</h2>
            {isConnected && address && (
              <p className="mt-1 font-mono text-xs text-axion-text-tertiary">{address}</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            {useReal && (
              <button onClick={fetchData} disabled={refreshing}
                className="flex items-center gap-1.5 rounded-lg border border-axion-border bg-axion-bg-tertiary px-3 py-1.5 text-xs text-axion-text-secondary transition-all hover:text-white disabled:opacity-50">
                <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
                Refresh
              </button>
            )}
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-brand" />
              <span className="text-xs text-axion-text-secondary">
                {isConnected ? `${stakes.filter((s) => s.status !== "claimed").length} Active Stakes` : "Connect to view"}
              </span>
            </div>
          </div>
        </div>

        {/* ====== CONNECTED STATE ====== */}
        {isConnected && (
          <>
            {/* Contract not ready warning */}
            {!isReady && (
              <div className="mb-6 flex items-start gap-2 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                <div className="text-xs text-amber-300">
                  <p className="font-semibold">Contract not configured</p>
                  <p className="mt-1">Set your contract address in <code className="rounded bg-amber-500/10 px-1">src/contracts/contract.ts</code></p>
                </div>
              </div>
            )}

            {error && (
              <div className="mb-6 flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                <p className="text-xs text-red-300">{error}</p>
              </div>
            )}

            {largeClaimNotice && (
              <div className="mb-6 flex items-start gap-2 rounded-xl border border-blue-500/20 bg-blue-500/5 px-4 py-3">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" />
                <p className="text-xs text-blue-300">{largeClaimNotice}</p>
              </div>
            )}

            {isWrongNetwork && (
              <div className="mb-6 flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                <div className="text-xs text-red-300">
                  <p>Wrong network detected.</p>
                  <button onClick={switchNetwork} className="mt-2 rounded-lg bg-red-500/20 px-3 py-1 text-xs font-semibold text-red-300 hover:bg-red-500/30">Switch Network</button>
                </div>
              </div>
            )}

            {/* Summary Cards */}
            <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-4">
              <div className="rounded-2xl border border-axion-border bg-axion-bg-tertiary p-4">
                <div className="mb-2 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/10"><Wallet className="h-4 w-4 text-brand" /></div>
                  <span className="text-xs text-axion-text-tertiary">Wallet</span>
                </div>
                <p className="font-tabular text-xl font-bold text-white">{summary.walletBalance.toFixed(4)}</p>
                <p className="text-xs text-axion-text-muted">BNB Available</p>
              </div>
              <div className="rounded-2xl border border-axion-border bg-axion-bg-tertiary p-4">
                <div className="mb-2 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10"><Lock className="h-4 w-4 text-blue-400" /></div>
                  <span className="text-xs text-axion-text-tertiary">Delegated</span>
                </div>
                <p className="font-tabular text-xl font-bold text-white">{summary.totalDelegated.toFixed(4)}</p>
                <p className="text-xs text-axion-text-muted">BNB Locked</p>
              </div>
              <div className="rounded-2xl border border-axion-border bg-axion-bg-tertiary p-4">
                <div className="mb-2 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-axion-success-glow"><Gift className="h-4 w-4 text-axion-success" /></div>
                  <span className="text-xs text-axion-text-tertiary">Ready to Claim</span>
                </div>
                <p className="font-tabular text-xl font-bold text-axion-success">{summary.totalReady.toFixed(4)}</p>
                <p className="text-xs text-axion-text-muted">{summary.claimableCount} stake{summary.claimableCount !== 1 ? "s" : ""}</p>
              </div>
              <div className="rounded-2xl border border-axion-border bg-axion-bg-tertiary p-4">
                <div className="mb-2 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10"><CheckCircle2 className="h-4 w-4 text-purple-400" /></div>
                  <span className="text-xs text-axion-text-tertiary">Claimed</span>
                </div>
                <p className="font-tabular text-xl font-bold text-white">{summary.totalClaimed.toFixed(4)}</p>
                <p className="text-xs text-axion-text-muted">BNB Total</p>
              </div>
            </div>

            {/* Stakes Table */}
            <div className="mb-8 rounded-2xl border border-axion-border bg-axion-bg-tertiary">
              <div className="flex items-center justify-between border-b border-axion-border px-5 py-4">
                <h3 className="text-sm font-semibold text-white">My Stakes</h3>
                {summary.claimableCount > 0 && isReady && (
                  <button onClick={handleClaimAll} disabled={claimingAll}
                    className="flex items-center gap-2 rounded-xl bg-axion-success px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-axion-success/90 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50">
                    <Gift className="h-3.5 w-3.5" />
                    {claimingAll ? "Claiming All..." : `Claim All (${summary.totalReady.toFixed(4)} BNB)`}
                  </button>
                )}
              </div>

              {stakes.length === 0 ? (
                <EmptyState
                  icon={<Inbox className="h-5 w-5 text-axion-text-muted" />}
                  title="No Stakes Yet"
                  description="This table will display all your staking positions, including lock period, progress, estimated rewards, and claim status. Start staking BNB to see your first position here."
                  action={
                    <a href="#staking" className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-brand/10 px-4 py-2 text-xs font-medium text-brand transition-all hover:bg-brand/20">
                      Go to Staking <ArrowRight className="h-3 w-3" />
                    </a>
                  }
                />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[750px]">
                    <thead>
                      <tr className="border-b border-axion-border">
                        <th className="px-5 py-3 text-left text-xs font-medium text-axion-text-tertiary">Amount</th>
                        <th className="px-5 py-3 text-left text-xs font-medium text-axion-text-tertiary">Plan</th>
                        <th className="px-5 py-3 text-left text-xs font-medium text-axion-text-tertiary">Period</th>
                        <th className="px-5 py-3 text-left text-xs font-medium text-axion-text-tertiary">Progress</th>
                        <th className="px-5 py-3 text-right text-xs font-medium text-axion-text-tertiary">Reward</th>
                        <th className="px-5 py-3 text-right text-xs font-medium text-axion-text-tertiary">On Claim</th>
                        <th className="px-5 py-3 text-right text-xs font-medium text-axion-text-tertiary">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stakes.map((stake) => {
                        const preview = getClaimPreview(stake);
                        const days = Math.round(stake.periodSeconds / 86400);
                        const ratePct = (stake.dailyRate / 100).toFixed(2);
                        return (
                          <tr key={stake.id} className="border-b border-axion-border/50 transition-colors hover:bg-axion-bg-secondary">
                            <td className="px-5 py-4"><span className="font-tabular text-sm font-medium text-white">{parseFloat(stake.principal).toFixed(4)} BNB</span></td>
                            <td className="px-5 py-4"><span className="rounded-full bg-brand/10 px-2 py-0.5 text-xs font-medium text-brand">{days}D @ {ratePct}%/day</span></td>
                            <td className="px-5 py-4"><div className="text-xs text-axion-text-secondary"><div>{formatDate(stake.startTime)}</div><div className="text-axion-text-muted">→ {formatDate(stake.endTime)}</div></div></td>
                            <td className="px-5 py-4">
                              <div className="w-full max-w-[100px]">
                                <div className="mb-1 text-[10px] text-axion-text-muted">{stake.progress}%</div>
                                <div className="h-1.5 w-full overflow-hidden rounded-full bg-axion-bg-secondary">
                                  <div className="h-full rounded-full transition-all" style={{ width: `${stake.progress}%`, backgroundColor: stake.status === "claimable" ? "#22C55E" : stake.status === "claimed" ? "#8B5CF6" : "#1199FF" }} />
                                </div>
                              </div>
                            </td>
                            <td className="px-5 py-4 text-right"><span className="font-tabular text-sm text-axion-success">+{parseFloat(stake.reward).toFixed(6)}</span></td>
                            <td className="px-5 py-4 text-right"><span className={`font-tabular text-xs ${preview.color}`}>{preview.label}</span></td>
                            <td className="px-5 py-4 text-right">
                              {stake.status === "locked" && <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2.5 py-1 text-xs font-medium text-blue-400"><Lock className="h-3 w-3" />Locked</span>}
                              {stake.status === "claimable" && (
                                <button onClick={() => handleClaim(stake.id)} disabled={claiming === stake.id || !isReady}
                                  className="inline-flex items-center gap-1 rounded-full bg-axion-success/15 px-3 py-1.5 text-xs font-semibold text-axion-success transition-all hover:bg-axion-success hover:text-white disabled:cursor-not-allowed disabled:opacity-50">
                                  <Gift className="h-3 w-3" />{claiming === stake.id ? "..." : "Claim"}
                                </button>
                              )}
                              {stake.status === "claimed" && <span className="inline-flex items-center gap-1 rounded-full bg-purple-500/10 px-2.5 py-1 text-xs font-medium text-purple-400"><CheckCircle2 className="h-3 w-3" />Claimed</span>}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* ====== REFERRAL ====== */}
            <div className="rounded-2xl border border-axion-border bg-axion-bg-tertiary">
              <div className="border-b border-axion-border px-5 py-4">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-brand" />
                  <h3 className="text-sm font-semibold text-white">Referral Program</h3>
                  <span className="ml-2 rounded-full bg-brand/10 px-2 py-0.5 text-[10px] font-semibold text-brand">1% L1 / 0.25% L2</span>
                </div>
              </div>

              <div className="p-5">
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                  {/* Left: Referral Link + Stats */}
                  <div className="lg:col-span-2 space-y-5">
                    {/* Referral Link */}
                    <div>
                      {referralUnlocked ? (
                        <>
                          <label className="mb-2 block text-xs text-axion-text-tertiary">Your Referral Link</label>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 overflow-hidden rounded-xl border border-axion-border bg-axion-bg-secondary px-4 py-3">
                              <p className="truncate font-mono text-sm text-axion-text-secondary">{referralLink || "Connect wallet to get your link"}</p>
                            </div>
                            <button onClick={handleCopy} disabled={!referralLink}
                              className="flex shrink-0 items-center gap-2 rounded-xl border border-axion-border bg-axion-bg-secondary px-4 py-3 text-sm font-medium text-white transition-all hover:border-brand hover:bg-brand/10 disabled:cursor-not-allowed disabled:opacity-50">
                              {copied ? <><Check className="h-4 w-4 text-axion-success" /><span className="text-axion-success">Copied</span></>
                                : <><Copy className="h-4 w-4" />Copy</>}
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
                          <div className="flex items-center gap-2">
                            <Lock className="h-4 w-4 text-amber-400" />
                            <span className="text-sm font-semibold text-amber-300">Referral Link Locked</span>
                          </div>
                          <p className="mt-1.5 text-xs text-amber-200/70">
                            Stake at least <span className="font-semibold text-amber-300">0.01 BNB</span> to unlock your referral link and start earning commissions.
                          </p>
                          <a href="#staking" className="mt-3 inline-flex items-center gap-1 rounded-lg bg-brand/20 px-3 py-1.5 text-xs font-medium text-brand transition-all hover:bg-brand/30">
                            Go Stake Now <ArrowRight className="h-3 w-3" />
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Stats Row - shows real data (0 if no referrals) */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="rounded-xl border border-axion-border bg-axion-bg-secondary p-3 text-center">
                        <p className="font-tabular text-xl font-bold text-brand">{referral.l1Count}</p>
                        <p className="text-[10px] text-axion-text-muted">Direct (L1)</p>
                      </div>
                      <div className="rounded-xl border border-axion-border bg-axion-bg-secondary p-3 text-center">
                        <p className="font-tabular text-xl font-bold text-axion-success">{referral.l2Count}</p>
                        <p className="text-[10px] text-axion-text-muted">Team (L2)</p>
                      </div>
                      <div className="rounded-xl border border-axion-border bg-axion-bg-secondary p-3 text-center">
                        <p className="font-tabular text-xl font-bold text-white">{referral.l1Count + referral.l2Count}</p>
                        <p className="text-[10px] text-axion-text-muted">Total Team</p>
                      </div>
                    </div>

                    {/* Commission History - real or empty state */}
                    {hasReferralActivity ? (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-axion-border">
                              <th className="px-3 py-2 text-left text-[10px] font-medium text-axion-text-tertiary">From</th>
                              <th className="px-3 py-2 text-left text-[10px] font-medium text-axion-text-tertiary">Stake</th>
                              <th className="px-3 py-2 text-center text-[10px] font-medium text-axion-text-tertiary">Lv</th>
                              <th className="px-3 py-2 text-right text-[10px] font-medium text-axion-text-tertiary">Commission</th>
                              <th className="px-3 py-2 text-right text-[10px] font-medium text-axion-text-tertiary">Time</th>
                            </tr>
                          </thead>
                          <tbody>
                            {/* Real commission data would go here from contract */}
                            <tr>
                              <td colSpan={5} className="px-3 py-6 text-center text-xs text-axion-text-muted">
                                Commission history loaded from contract
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <EmptyState
                        icon={<Users className="h-5 w-5 text-axion-text-muted" />}
                        title="No Referral Earnings Yet"
                        description="This table will display your referral commission history, including who staked through your link, their stake amount, commission earned, and timestamp. Share your referral link to start earning."
                      />
                    )}
                  </div>

                  {/* Right: Earnings + Claim */}
                  <div className="space-y-4">
                    <div className="rounded-xl border border-axion-border bg-axion-bg-secondary p-4">
                      <div className="mb-3 flex items-center gap-2">
                        <Coins className="h-4 w-4 text-brand" />
                        <span className="text-xs font-medium text-axion-text-secondary">My Earnings</span>
                      </div>
                      <div className="mb-3">
                        <p className="mb-1 text-[10px] text-axion-text-tertiary">Available to Claim</p>
                        <p className="font-tabular text-2xl font-bold text-axion-success">{parseFloat(referral.commissionBalance).toFixed(3)} BNB</p>
                      </div>
                      <div className="mb-4 border-t border-axion-border pt-3">
                        <p className="mb-1 text-[10px] text-axion-text-tertiary">Total Earned</p>
                        <p className="font-tabular text-base font-semibold text-white">{parseFloat(referral.totalCommissionEarned).toFixed(3)} BNB</p>
                      </div>
                      <button onClick={handleClaimCommission} disabled={parseFloat(referral.commissionBalance) <= 0 || commissionClaiming || !isReady}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-axion-success/15 py-2.5 text-xs font-semibold text-axion-success transition-all hover:bg-axion-success hover:text-white disabled:cursor-not-allowed disabled:opacity-40">
                        <Gift className="h-4 w-4" />{commissionClaiming ? "Claiming..." : `Claim ${parseFloat(referral.commissionBalance).toFixed(3)} BNB`}
                      </button>
                    </div>

                    {/* How It Works */}
                    <div className="rounded-xl border border-axion-border bg-axion-bg-secondary p-4">
                      <p className="mb-2.5 text-xs font-medium text-axion-text-secondary">How It Works</p>
                      <div className="space-y-2">
                        {["Share your link", "Friends stake BNB", "Earn 1% (L1) or 0.25% (L2)", "Claim anytime"].map((text, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand/15 text-[9px] font-bold text-brand">{i + 1}</span>
                            <p className="text-[11px] leading-relaxed text-axion-text-tertiary">{text}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Documentation Link */}
                    <Link
                      to="/docs"
                      className="flex items-center gap-2 rounded-xl border border-brand/20 bg-brand/5 p-3 text-xs font-medium text-brand transition-all hover:bg-brand/10"
                    >
                      <BookOpen className="h-4 w-4" />
                      Read full documentation
                      <ArrowRight className="ml-auto h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ====== NOT CONNECTED STATE ====== */}
        {!isConnected && (
          <div className="rounded-2xl border border-axion-border bg-axion-bg-tertiary p-10">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand/10">
                <Wallet className="h-8 w-8 text-brand" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">Connect Your Wallet</h3>
              <p className="mb-6 max-w-sm text-sm text-axion-text-secondary">
                Connect your wallet to view your staking dashboard, track your earnings, and manage your referral program.
              </p>
              <button
                onClick={() => window.dispatchEvent(new CustomEvent("open-wallet-selector"))}
                className="flex items-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-brand-light hover:shadow-brand-glow"
              >
                <Wallet className="h-4 w-4" />
                Connect Wallet
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
