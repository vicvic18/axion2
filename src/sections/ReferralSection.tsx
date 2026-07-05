import { useState, useMemo } from "react";
import { useWallet } from "../context/WalletContext";
import {
  Copy,
  Check,
  Users,
  UserPlus,
  Coins,
  Gift,
  Link2,
  TrendingUp,
  Wallet,
} from "lucide-react";

// Mock commission history data
interface CommissionRecord {
  id: number;
  from: string;
  amount: number;
  level: 1 | 2;
  timestamp: string;
  stakeAmount: number;
}

const mockCommissionHistory: CommissionRecord[] = [
  {
    id: 1,
    from: "0x7a2b...9c3d",
    amount: 0.5,
    level: 1,
    timestamp: "2026-06-18 14:32",
    stakeAmount: 10,
  },
  {
    id: 2,
    from: "0x3f4e...8a1b",
    amount: 0.2,
    level: 2,
    timestamp: "2026-06-18 12:15",
    stakeAmount: 10,
  },
  {
    id: 3,
    from: "0x9c1d...2e4f",
    amount: 0.025,
    level: 1,
    timestamp: "2026-06-17 09:45",
    stakeAmount: 0.5,
  },
  {
    id: 4,
    from: "0x5a6b...7c8d",
    amount: 0.1,
    level: 2,
    timestamp: "2026-06-16 18:22",
    stakeAmount: 5,
  },
  {
    id: 5,
    from: "0x1e2f...3a4b",
    amount: 0.25,
    level: 1,
    timestamp: "2026-06-15 11:08",
    stakeAmount: 5,
  },
];

// Mock referral stats
const mockStats = {
  l1Count: 8,
  l2Count: 23,
  commissionBalance: 1.075,
  totalCommissionEarned: 4.35,
  referrer: "0xC1DA8b99674137CC4971bF974cdC5157c8B86AaF",
};

export default function ReferralSection() {
  const { isConnected, address } = useWallet();
  const [copied, setCopied] = useState(false);
  const [claiming, setClaiming] = useState(false);

  // Generate referral link based on wallet address
  const referralLink = useMemo(() => {
    if (!address) return "";
    // Use current origin + ?ref=address
    const origin = typeof window !== "undefined" ? window.location.origin : "https://axionstake.com";
    return `${origin}/?ref=${address}`;
  }, [address]);

  const handleCopy = async () => {
    if (!referralLink) return;
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = referralLink;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClaimCommission = async () => {
    if (mockStats.commissionBalance <= 0) return;
    setClaiming(true);
    await new Promise((r) => setTimeout(r, 1500));
    setClaiming(false);
  };

  if (!isConnected) {
    return (
      <section id="referral" className="bg-[#0A0A0A] py-16 md:py-20">
        <div className="mx-auto max-w-[1200px] px-6">
          <h2 className="mb-6 text-2xl font-semibold text-white md:text-3xl">
            Referral Program
          </h2>
          <div className="flex flex-col items-center justify-center rounded-2xl border border-axion-border bg-axion-bg-tertiary py-16">
            <Users className="mb-4 h-12 w-12 text-axion-text-muted" />
            <p className="mb-1 text-base font-medium text-white">Connect Your Wallet</p>
            <p className="text-sm text-axion-text-muted">
              Connect to access your referral dashboard and invite friends
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="referral" className="bg-[#0A0A0A] py-16 md:py-20">
      <div className="mx-auto max-w-[1200px] px-6">
        {/* Header */}
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Users className="h-5 w-5 text-brand" />
              <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand uppercase tracking-wide">
                Earn More
              </span>
            </div>
            <h2 className="text-2xl font-semibold text-white md:text-3xl">
              Referral Program
            </h2>
            <p className="mt-1 text-sm text-axion-text-secondary">
              Invite friends and earn commissions on their stakes. Two-level rewards system.
            </p>
          </div>
        </div>

        {/* Commission Rate Cards */}
        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-axion-border bg-axion-bg-secondary p-4 text-center">
            <p className="mb-1 text-xs text-axion-text-tertiary">L1 Commission</p>
            <p className="font-tabular text-3xl font-bold text-brand">5%</p>
            <p className="text-xs text-axion-text-muted">Direct referral</p>
          </div>
          <div className="rounded-2xl border border-axion-border bg-axion-bg-secondary p-4 text-center">
            <p className="mb-1 text-xs text-axion-text-tertiary">L2 Commission</p>
            <p className="font-tabular text-3xl font-bold text-axion-success">2%</p>
            <p className="text-xs text-axion-text-muted">Indirect referral</p>
          </div>
          <div className="rounded-2xl border border-axion-border bg-axion-bg-secondary p-4 text-center">
            <p className="mb-1 text-xs text-axion-text-tertiary">L1 Referrals</p>
            <p className="font-tabular text-3xl font-bold text-white">{mockStats.l1Count}</p>
            <p className="text-xs text-axion-text-muted">Direct invites</p>
          </div>
          <div className="rounded-2xl border border-axion-border bg-axion-bg-secondary p-4 text-center">
            <p className="mb-1 text-xs text-axion-text-tertiary">L2 Referrals</p>
            <p className="font-tabular text-3xl font-bold text-white">{mockStats.l2Count}</p>
            <p className="text-xs text-axion-text-muted">Team members</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left: Referral Link */}
          <div className="lg:col-span-2">
            {/* Referral Link Card */}
            <div className="mb-6 rounded-2xl border border-axion-border bg-axion-bg-secondary p-6">
              <div className="mb-4 flex items-center gap-2">
                <Link2 className="h-4 w-4 text-brand" />
                <h3 className="text-sm font-semibold text-white">Your Referral Link</h3>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 overflow-hidden rounded-xl border border-axion-border bg-axion-bg-tertiary px-4 py-3">
                  <p className="truncate font-mono text-sm text-axion-text-secondary">
                    {referralLink}
                  </p>
                </div>
                <button
                  onClick={handleCopy}
                  className="flex shrink-0 items-center gap-2 rounded-xl border border-axion-border bg-axion-bg-tertiary px-4 py-3 text-sm font-medium text-white transition-all hover:border-brand hover:bg-brand/10"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 text-axion-success" />
                      <span className="text-axion-success">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy
                    </>
                  )}
                </button>
              </div>
              <p className="mt-3 text-xs text-axion-text-muted">
                Share this link with friends. When they stake BNB, you earn commissions automatically.
              </p>
            </div>

            {/* Commission History Table */}
            <div className="rounded-2xl border border-axion-border bg-axion-bg-secondary">
              <div className="flex items-center justify-between border-b border-axion-border px-5 py-4">
                <h3 className="text-sm font-semibold text-white">Commission History</h3>
                <span className="text-xs text-axion-text-muted">
                  {mockCommissionHistory.length} records
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[500px]">
                  <thead>
                    <tr className="border-b border-axion-border">
                      <th className="px-5 py-3 text-left text-xs font-medium text-axion-text-tertiary">From</th>
                      <th className="px-5 py-3 text-left text-xs font-medium text-axion-text-tertiary">Stake</th>
                      <th className="px-5 py-3 text-center text-xs font-medium text-axion-text-tertiary">Level</th>
                      <th className="px-5 py-3 text-right text-xs font-medium text-axion-text-tertiary">Commission</th>
                      <th className="px-5 py-3 text-right text-xs font-medium text-axion-text-tertiary">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockCommissionHistory.map((record) => (
                      <tr
                        key={record.id}
                        className="border-b border-axion-border/50 transition-colors hover:bg-axion-bg-tertiary"
                      >
                        <td className="px-5 py-3.5">
                          <span className="font-mono text-xs text-axion-text-secondary">
                            {record.from}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="font-tabular text-xs text-white">
                            {record.stakeAmount} BNB
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-center">
                          <span
                            className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                              record.level === 1
                                ? "bg-brand/15 text-brand"
                                : "bg-axion-success/15 text-axion-success"
                            }`}
                          >
                            L{record.level}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <span className="font-tabular text-sm font-semibold text-axion-success">
                            +{record.amount.toFixed(3)}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <span className="text-xs text-axion-text-muted">
                            {record.timestamp}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right: Stats & Claim */}
          <div className="space-y-4">
            {/* Earnings Card */}
            <div className="rounded-2xl border border-axion-border bg-axion-bg-secondary p-5">
              <div className="mb-4 flex items-center gap-2">
                <Coins className="h-4 w-4 text-brand" />
                <h3 className="text-sm font-semibold text-white">My Earnings</h3>
              </div>

              <div className="mb-4">
                <p className="mb-1 text-xs text-axion-text-tertiary">Available to Claim</p>
                <p className="font-tabular text-3xl font-bold text-axion-success">
                  {mockStats.commissionBalance.toFixed(3)} BNB
                </p>
              </div>

              <div className="mb-5 border-t border-axion-border pt-4">
                <p className="mb-1 text-xs text-axion-text-tertiary">Total Earned</p>
                <p className="font-tabular text-xl font-semibold text-white">
                  {mockStats.totalCommissionEarned.toFixed(3)} BNB
                </p>
              </div>

              <button
                onClick={handleClaimCommission}
                disabled={mockStats.commissionBalance <= 0 || claiming}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-axion-success/15 py-3 text-sm font-semibold text-axion-success transition-all hover:bg-axion-success hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Gift className="h-4 w-4" />
                {claiming ? "Claiming..." : `Claim ${mockStats.commissionBalance.toFixed(3)} BNB`}
              </button>
            </div>

            {/* Team Overview */}
            <div className="rounded-2xl border border-axion-border bg-axion-bg-secondary p-5">
              <div className="mb-4 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-brand" />
                <h3 className="text-sm font-semibold text-white">Team Overview</h3>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <UserPlus className="h-4 w-4 text-brand" />
                    <span className="text-xs text-axion-text-secondary">Direct (L1)</span>
                  </div>
                  <span className="font-tabular text-sm font-semibold text-white">
                    {mockStats.l1Count}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-axion-success" />
                    <span className="text-xs text-axion-text-secondary">Team (L2)</span>
                  </div>
                  <span className="font-tabular text-sm font-semibold text-white">
                    {mockStats.l2Count}
                  </span>
                </div>
                <div className="flex items-center justify-between border-t border-axion-border pt-3">
                  <div className="flex items-center gap-2">
                    <Wallet className="h-4 w-4 text-axion-text-muted" />
                    <span className="text-xs text-axion-text-secondary">Total Team</span>
                  </div>
                  <span className="font-tabular text-sm font-semibold text-white">
                    {mockStats.l1Count + mockStats.l2Count}
                  </span>
                </div>
              </div>
            </div>

            {/* How it works */}
            <div className="rounded-2xl border border-axion-border bg-axion-bg-secondary p-5">
              <h3 className="mb-3 text-sm font-semibold text-white">How It Works</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand/15 text-[10px] font-bold text-brand">
                    1
                  </span>
                  <p className="text-xs leading-relaxed text-axion-text-secondary">
                    Share your referral link with friends
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand/15 text-[10px] font-bold text-brand">
                    2
                  </span>
                  <p className="text-xs leading-relaxed text-axion-text-secondary">
                    Friends stake BNB through your link
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand/15 text-[10px] font-bold text-brand">
                    3
                  </span>
                  <p className="text-xs leading-relaxed text-axion-text-secondary">
                    Earn 5% (L1) or 2% (L2) commission on each stake
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand/15 text-[10px] font-bold text-brand">
                    4
                  </span>
                  <p className="text-xs leading-relaxed text-axion-text-secondary">
                    Claim your commissions anytime
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
