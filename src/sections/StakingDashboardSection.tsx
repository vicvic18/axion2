import { useState, useMemo, useEffect } from "react";
import { useWallet } from "../context/WalletContext";
import { useContract } from "../hooks/useContract";
import {
  Clock,
  TrendingUp,
  ArrowRight,
  Lock,
  Percent,
  Flame,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

// Default day seconds - production: 86400 (1 day)
const DEFAULT_DAY_SECONDS = 86400;

// Plan definitions (day multipliers, not hardcoded seconds)
const PLANS = [
  { id: 1, dayMultiplier: 1, dailyRate: 1.26, icon: <Clock className="h-5 w-5" />,     color: "#1199FF", popular: true },
  { id: 7, dayMultiplier: 7, dailyRate: 1.48, icon: <TrendingUp className="h-5 w-5" />, color: "#22C55E", popular: false },
];

const EVENT_END = new Date("2026-09-01T00:00:00Z");

/// Calculate reward matching contract formula: days = periodSeconds / daySeconds, min 1 day
function calcReward(bnb: number, ratePercent: number, periodSeconds: number, daySeconds: number): number {
  const daysNum = Math.max(1, periodSeconds / daySeconds);
  return (bnb * ratePercent * daysNum) / 100;
}

function useCountdown(target: Date) {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const diff = Math.max(0, target.getTime() - now.getTime());
  return {
    d: Math.floor(diff / 86400000),
    h: Math.floor((diff % 86400000) / 3600000),
    m: Math.floor((diff % 3600000) / 60000),
    s: Math.floor((diff % 60000) / 1000),
  };
}

function formatPeriod(seconds: number): string {
  if (seconds < 60) return `${seconds} Sec`;
  if (seconds < 3600) return `${Math.round(seconds / 60)} Min`;
  if (seconds < 86400) return `${Math.round(seconds / 3600)} Hrs`;
  const days = seconds / 86400;
  return days === 1 ? "1 Day" : `${days} Days`;
}

export default function StakingDashboardSection() {
  const { isConnected, isWrongNetwork, switchNetwork, balance } = useWallet();
  const { isReady, loading, error, setError, stake, contract } = useContract();
  const [sel, setSel] = useState(1); // plan id (1 or 7)
  const [amt, setAmt] = useState("");
  const [staking, setStaking] = useState(false);
  const [txSuccess, setTxSuccess] = useState(false);
  const [daySeconds, setDaySeconds] = useState<number>(DEFAULT_DAY_SECONDS);
  const cd = useCountdown(EVENT_END);

  // Read ONE_DAY_SECONDS from contract when connected
  useEffect(() => {
    if (!contract) return;
    contract.ONE_DAY_SECONDS().then((val: bigint) => {
      setDaySeconds(Number(val));
    }).catch(() => {
      // fallback to default
    });
  }, [contract]);

  // Derive actual period seconds from contract's daySeconds
  const plan = PLANS.find((p) => p.id === sel)!;
  const periodSeconds = plan.dayMultiplier * daySeconds;
  const periodLabel = formatPeriod(periodSeconds);
  const description = plan.dayMultiplier === 1
    ? `${plan.dailyRate}% daily reward`
    : `${plan.dailyRate}% daily × ${plan.dayMultiplier} days`;

  const bnb = parseFloat(amt) || 0;
  const rw = useMemo(
    () => calcReward(bnb, plan.dailyRate, periodSeconds, daySeconds),
    [bnb, plan, periodSeconds, daySeconds]
  );

  // Get referrer from URL ?ref=0x...
  const referrer = useMemo(() => {
    if (typeof window === "undefined") return undefined;
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    return ref && ref.startsWith("0x") && ref.length === 42 ? ref : undefined;
  }, []);

  const doStake = async () => {
    if (!isConnected || bnb <= 0) return;
    if (isWrongNetwork) { await switchNetwork(); return; }

    // Check balance before staking
    const balanceNum = parseFloat(balance || "0");
    if (balanceNum < bnb) {
      setError(`Insufficient BNB balance. Wallet: ${balanceNum.toFixed(6)} BNB, Stake: ${bnb} BNB`);
      return;
    }

    setStaking(true);
    setTxSuccess(false);
    setError(null);
    const success = await stake(String(bnb), periodSeconds, referrer);
    if (success) {
      setTxSuccess(true);
      setAmt("");
      setTimeout(() => setTxSuccess(false), 5000);
    }
    setStaking(false);
  };

  return (
    <section id="staking" className="relative overflow-hidden bg-[#0A0A0A] py-10 md:py-16 lg:py-20">
      {/* Background glow */}
      <div className="pointer-events-none absolute -top-40 right-0 h-[500px] w-[500px] rounded-full opacity-[0.06] blur-3xl" style={{ background: "radial-gradient(circle, #FFD700 0%, transparent 70%)" }} />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-[400px] w-[400px] rounded-full opacity-[0.04] blur-3xl" style={{ background: "radial-gradient(circle, #1199FF 0%, transparent 70%)" }} />

      <div className="relative mx-auto max-w-[1200px] px-6">
        {/* Event Banner - Football Summer */}
        <div className="relative mb-6 overflow-hidden rounded-xl border border-[#2A2A2E] md:mb-8 md:rounded-2xl">
          {/* Background layers */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0c1628] via-[#0f1120] to-[#0c1f15]" />
          <div className="pointer-events-none absolute -right-16 -top-24 h-[200px] w-[200px] rounded-full opacity-[0.15] blur-3xl md:h-[280px] md:w-[280px]" style={{ background: "radial-gradient(circle, #1199FF 0%, transparent 70%)" }} />
          <div className="pointer-events-none absolute -left-12 -bottom-20 h-[180px] w-[180px] rounded-full opacity-[0.12] blur-3xl md:h-[240px] md:w-[240px]" style={{ background: "radial-gradient(circle, #22C55E 0%, transparent 70%)" }} />

          <div className="relative px-4 py-3 md:px-8 md:py-6">
            {/* Top row: Logo + Title + Badge + Countdown */}
            <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center md:gap-4">
              <div className="flex items-center gap-2 md:gap-3">
                <img src="/wc2026-logo.png" alt="Football Summer" className="h-8 w-auto md:h-10" />
                <div>
                  <div className="flex items-center gap-1.5 md:gap-2">
                    <h2 className="text-base font-bold tracking-tight text-white md:text-lg lg:text-xl">Football Summer</h2>
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-500/15 px-1.5 py-0.5 text-[9px] font-bold text-red-400 uppercase tracking-wider md:px-2 md:text-[10px]">
                      <Flame className="h-2.5 w-2.5 md:h-3 md:w-3" />Ends Sep 1
                    </span>
                  </div>
                  <p className="mt-0.5 text-[10px] text-axion-text-muted md:text-xs">Limited time boosted staking rates for the football season</p>
                </div>
              </div>

              {/* Countdown */}
              <div className="flex items-center gap-2 md:gap-3">
                {[
                  { v: cd.d, l: "Days" },
                  { v: cd.h, l: "Hrs" },
                  { v: cd.m, l: "Min" },
                  { v: cd.s, l: "Sec" },
                ].map((u, i) => (
                  <div key={u.l} className="flex items-center gap-2 md:gap-3">
                    {i > 0 && <span className="text-sm font-bold text-axion-text-muted/30 md:text-lg">:</span>}
                    <div className="flex flex-col items-center">
                      <span className="font-tabular text-lg font-bold text-white md:text-2xl lg:text-3xl">{String(u.v).padStart(2, "0")}</span>
                      <span className="text-[8px] text-axion-text-muted uppercase md:text-[9px]">{u.l}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="my-3 border-t border-white/5 md:my-4" />

            {/* Bottom row: Rate badges */}
            <div className="flex flex-wrap items-center gap-2 md:gap-3">
              <span className="text-[10px] text-axion-text-muted md:text-xs">Current rates:</span>
              <span className="inline-flex items-center gap-1 rounded-md bg-brand/10 px-2 py-1 text-[10px] font-bold text-brand md:rounded-lg md:px-3 md:py-1.5 md:text-xs">
                <Percent className="h-2.5 w-2.5 md:h-3 md:w-3" />1 Day = 1.26%
              </span>
              <span className="inline-flex items-center gap-1 rounded-md bg-green-500/10 px-2 py-1 text-[10px] font-bold text-green-400 md:rounded-lg md:px-3 md:py-1.5 md:text-xs">
                <Percent className="h-2.5 w-2.5 md:h-3 md:w-3" />7 Days = 1.48%
              </span>
              <span className="ml-auto text-[9px] text-axion-text-muted italic md:text-[10px]">Stakes placed before Sep 1 keep these rates</span>
            </div>
          </div>
        </div>

        {/* Sync indicator */}
        {isReady && (
          <div className="mb-4 flex items-center gap-2 text-xs text-axion-text-muted">
            <div className="h-1.5 w-1.5 rounded-full bg-axion-success" />
            Synced with contract: 1 day = {daySeconds} second{daySeconds !== 1 ? "s" : ""}
          </div>
        )}

        {/* Staking Content */}
        <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-2">
          {/* Left: Plans */}
          <div className="space-y-2 md:space-y-3">
            {PLANS.map((p) => (
              <button
                key={p.id}
                onClick={() => setSel(p.id)}
                className={`flex w-full items-center gap-3 rounded-xl border p-3.5 text-left transition-all md:gap-4 md:rounded-2xl md:p-5 ${
                  sel === p.id ? "border-brand bg-brand/5" : "border-axion-border bg-axion-bg-secondary hover:border-axion-border-hover"
                }`}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg md:h-12 md:w-12 md:rounded-xl" style={{ backgroundColor: `${p.color}15`, color: p.color }}>
                  {p.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 md:gap-2">
                    <span className="text-sm font-semibold text-white md:text-base">
                      {p.dayMultiplier} Day{p.dayMultiplier > 1 ? "s" : ""}
                    </span>
                    {p.popular && <span className="rounded-full bg-brand/15 px-1.5 py-0.5 text-[9px] font-semibold text-brand md:px-2 md:text-[10px]">Popular</span>}
                  </div>
                  <p className="text-[11px] text-axion-text-tertiary md:text-xs truncate">{description}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-tabular text-lg font-bold md:text-xl" style={{ color: p.color }}>{p.dailyRate}%</p>
                  <p className="text-[10px] text-axion-text-muted md:text-xs">/ day</p>
                </div>
              </button>
            ))}

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-axion-border bg-axion-bg-secondary p-4">
                <Percent className="mb-2 h-4 w-4 text-brand" />
                <p className="font-tabular text-lg font-semibold text-white">{plan.dailyRate}%</p>
                <p className="text-xs text-axion-text-muted">Daily Return</p>
              </div>
              <div className="rounded-xl border border-axion-border bg-axion-bg-secondary p-4">
                <Lock className="mb-2 h-4 w-4 text-axion-success" />
                <p className="font-tabular text-lg font-semibold text-white">{periodLabel}</p>
                <p className="text-xs text-axion-text-muted">Lock Period</p>
              </div>
            </div>

            <div className="mt-2 rounded-lg border border-axion-border bg-axion-bg-secondary p-3 md:mt-3 md:rounded-xl md:p-4">
              <p className="mb-2 text-[11px] font-medium text-axion-text-secondary md:mb-3 md:text-xs">How It Works</p>
              <div className="space-y-2 md:space-y-2.5">
                {["Choose a plan and enter the BNB amount", "Your BNB is locked while earning daily rewards", "After lock period, claim principal and reward"].map((t, i) => (
                  <div key={i} className="flex items-start gap-2 text-[11px] md:gap-2.5 md:text-xs">
                    <span className="mt-0.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-brand/15 text-[9px] font-bold text-brand md:h-4 md:w-4 md:text-[10px]">{i + 1}</span>
                    <span className="text-axion-text-tertiary">{t}</span>
                  </div>
                ))}

              </div>
            </div>
          </div>

          {/* Right: Input Panel */}
          <div className="rounded-xl border border-axion-border bg-axion-bg-secondary p-4 md:rounded-2xl md:p-6">
            <h3 className="mb-3 text-sm font-semibold text-white md:mb-4 md:text-base">Stake {plan.dayMultiplier} Day{plan.dayMultiplier > 1 ? "s" : ""}</h3>

            {error && (
              <div className="mb-4 flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                <p className="text-xs text-red-300">{error}</p>
              </div>
            )}
            {txSuccess && (
              <div className="mb-4 flex items-start gap-2 rounded-xl border border-green-500/20 bg-green-500/5 px-4 py-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-400" />
                <p className="text-xs text-green-300">Stake successful! Lock time: {periodLabel}.</p>
              </div>
            )}
            {!isReady && isConnected && (
              <div className="mb-4 flex items-start gap-2 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                <p className="text-xs text-amber-300">Contract address not configured.</p>
              </div>
            )}

            <div className="mb-3 md:mb-4">
              <div className="mb-1.5 flex items-center justify-between md:mb-2">
                <span className="text-[11px] text-axion-text-tertiary md:text-xs">Amount (BNB)</span>
                <span className="text-[11px] text-axion-text-muted md:text-xs">Balance: {parseFloat(balance || "0").toFixed(4)} BNB</span>
              </div>
              <div className="relative">
                <input type="number" value={amt} onChange={(e) => setAmt(e.target.value)} placeholder="0.00" min="0" step="0.001"
                  className="w-full rounded-lg border border-axion-border bg-axion-bg-tertiary px-3 py-2.5 text-base font-tabular text-white outline-none transition-colors placeholder:text-axion-text-muted focus:border-brand md:rounded-xl md:px-4 md:py-3 md:text-lg" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-white md:right-4 md:text-sm">BNB</span>
              </div>
              <div className="mt-1.5 flex flex-wrap items-center gap-1.5 md:mt-2 md:gap-2">
                <span className="text-[11px] text-axion-text-muted md:text-xs">Quick:</span>
                {[0.1, 0.5, 1, 5].map((q) => (
                  <button key={q} onClick={() => setAmt(q.toString())} className="rounded bg-axion-bg-tertiary px-1.5 py-0.5 text-[11px] text-axion-text-secondary transition-colors hover:bg-brand/10 hover:text-brand md:rounded-md md:px-2 md:text-xs">{q} BNB</button>
                ))}
              </div>
            </div>

            {bnb > 0 && (
              <div className="mb-4 space-y-2 rounded-lg bg-axion-bg-tertiary p-3 md:mb-5 md:space-y-3 md:rounded-xl md:p-4">
                <div className="flex items-center justify-between"><span className="text-[11px] text-axion-text-tertiary md:text-xs">Your Stake</span><span className="font-tabular text-xs text-white md:text-sm">{bnb.toFixed(4)} BNB</span></div>
                <div className="flex items-center justify-between"><span className="text-[11px] text-axion-text-tertiary md:text-xs">Daily Rate</span><span className="font-tabular text-xs text-brand md:text-sm">{plan.dailyRate}%</span></div>
                <div className="flex items-center justify-between"><span className="text-[11px] text-axion-text-tertiary md:text-xs">Lock Period</span><span className="font-tabular text-xs text-white md:text-sm">{periodLabel}</span></div>
                <div className="border-t border-axion-border pt-2 md:pt-3">
                  <div className="flex items-center justify-between"><span className="text-[11px] text-axion-text-tertiary md:text-xs">Est. Reward</span><span className="font-tabular text-xs text-axion-success md:text-sm">+{rw.toFixed(6)} BNB</span></div>
                  <div className="mt-1 flex items-center justify-between"><span className="text-[11px] text-axion-text-tertiary md:text-xs">Total Return</span><span className="font-tabular text-xs font-semibold text-white md:text-sm">{(bnb + rw).toFixed(6)} BNB</span></div>
                </div>
              </div>
            )}

            <button onClick={doStake} disabled={!isConnected || bnb <= 0 || staking || loading || parseFloat(balance || "0") < bnb}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand py-3 text-sm font-semibold text-white transition-all hover:bg-brand-light hover:shadow-brand-glow disabled:cursor-not-allowed disabled:opacity-50 md:rounded-xl md:py-3.5">
              {staking || loading ? "Processing..." : !isConnected ? "Connect Wallet to Stake" : isWrongNetwork ? "Switch Network" : bnb <= 0 ? "Enter Amount" : parseFloat(balance || "0") < bnb ? "Insufficient Balance" : <>Stake {bnb} BNB <ArrowRight className="h-4 w-4" /></>}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
