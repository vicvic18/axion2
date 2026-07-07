import { useState, useMemo, useEffect } from "react";
import { useWallet } from "../context/WalletContext";
import { useContract } from "../hooks/useContract";
import {
  Clock,
  Trophy,
  TrendingUp,
  ArrowRight,
  Lock,
  Percent,
  Timer,
  Sparkles,
  Flame,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

// Default day seconds when contract not connected (TEST=5, PROD=86400)
const DEFAULT_DAY_SECONDS = 86400;

// Plan definitions (day multipliers, not hardcoded seconds)
const PLANS = [
  { id: 1, dayMultiplier: 1, dailyRate: 1.3,  icon: <Clock className="h-5 w-5" />,     color: "#1199FF", popular: true },
  { id: 7, dayMultiplier: 7, dailyRate: 1.52, icon: <TrendingUp className="h-5 w-5" />, color: "#22C55E", popular: false },
];

const EVENT_END = new Date("2026-08-01T00:00:00Z");

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

function Unit({ v, l }: { v: number; l: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-axion-border bg-axion-bg-tertiary md:h-14 md:w-14">
        <span className="font-tabular text-lg font-bold text-white md:text-xl">{String(v).padStart(2, "0")}</span>
      </div>
      <span className="mt-1 text-[10px] text-axion-text-muted uppercase">{l}</span>
    </div>
  );
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
    <section id="staking" className="relative overflow-hidden bg-[#0A0A0A] py-16 md:py-20">
      {/* Background glow */}
      <div className="pointer-events-none absolute -top-40 right-0 h-[500px] w-[500px] rounded-full opacity-[0.06] blur-3xl" style={{ background: "radial-gradient(circle, #FFD700 0%, transparent 70%)" }} />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-[400px] w-[400px] rounded-full opacity-[0.04] blur-3xl" style={{ background: "radial-gradient(circle, #1199FF 0%, transparent 70%)" }} />

      <div className="relative mx-auto max-w-[1200px] px-6">
        {/* Event Header */}
        <div className="mb-8 rounded-2xl border border-[#2A2A2E] bg-gradient-to-br from-[#111111] via-[#141210] to-[#111111] p-6 md:p-8">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <div className="mb-3 flex items-center gap-2.5">
                <img src="/wc2026-logo.png" alt="FIFA World Cup 2026" className="h-7 w-auto" />
                <span className="text-xs font-bold tracking-widest text-white/60 uppercase">FIFA World Cup 2026</span>
              </div>
              <div className="mb-3 flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-3 py-1 text-xs font-bold text-amber-400 uppercase tracking-wider">
                  <Trophy className="h-3.5 w-3.5" />Limited Time Event
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/15 px-3 py-1 text-xs font-bold text-red-400 uppercase tracking-wider">
                  <Flame className="h-3.5 w-3.5" />Ends Aug 1
                </span>
              </div>
              <h2 className="mb-1 text-2xl font-semibold text-white md:text-3xl">
                Trial Staking <span className="text-amber-400">Championship</span>
              </h2>
              <p className="max-w-lg text-sm text-axion-text-secondary">
                Grab the limited-time high-yield rates before the season ends.
              </p>
            </div>
            <div className="flex shrink-0 flex-col items-end">
              <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-axion-text-tertiary">
                <Timer className="h-3.5 w-3.5" />Event Ends In
              </p>
              <div className="flex items-center gap-2">
                <Unit v={cd.d} l="Days" />
                <span className="pb-4 text-lg font-bold text-axion-text-muted">:</span>
                <Unit v={cd.h} l="Hrs" />
                <span className="pb-4 text-lg font-bold text-axion-text-muted">:</span>
                <Unit v={cd.m} l="Min" />
                <span className="pb-4 text-lg font-bold text-axion-text-muted">:</span>
                <Unit v={cd.s} l="Sec" />
              </div>
            </div>
          </div>
          <div className="mt-5 flex items-start gap-2 rounded-xl border border-amber-500/15 bg-amber-500/5 px-4 py-3">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
            <p className="text-xs leading-relaxed text-amber-200/70">
              <span className="font-semibold text-amber-400">Rate Change Notice:</span>{" "}
              After August 1, 2026, daily reward rates may be reduced. Stakes made before the deadline will keep the current rates for their full lock period.
            </p>
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
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Left: Plans */}
          <div className="space-y-3">
            {PLANS.map((p) => (
              <button
                key={p.id}
                onClick={() => setSel(p.id)}
                className={`flex w-full items-center gap-4 rounded-2xl border p-5 text-left transition-all ${
                  sel === p.id ? "border-brand bg-brand/5" : "border-axion-border bg-axion-bg-secondary hover:border-axion-border-hover"
                }`}
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: `${p.color}15`, color: p.color }}>
                  {p.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-semibold text-white">
                      {p.dayMultiplier} Day{p.dayMultiplier > 1 ? "s" : ""}
                    </span>
                    {p.popular && <span className="rounded-full bg-brand/15 px-2 py-0.5 text-[10px] font-semibold text-brand">Popular</span>}
                  </div>
                  <p className="text-xs text-axion-text-tertiary">{description}</p>
                </div>
                <div className="text-right">
                  <p className="font-tabular text-xl font-bold" style={{ color: p.color }}>{p.dailyRate}%</p>
                  <p className="text-xs text-axion-text-muted">/ day</p>
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

            <div className="mt-3 rounded-xl border border-axion-border bg-axion-bg-secondary p-4">
              <p className="mb-3 text-xs font-medium text-axion-text-secondary">How It Works</p>
              <div className="space-y-2.5">
                {["Choose a plan and enter the BNB amount", "Your BNB is locked while earning daily rewards", "After lock period, claim principal and reward"].map((t, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs">
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand/15 text-[10px] font-bold text-brand">{i + 1}</span>
                    <span className="text-axion-text-tertiary">{t}</span>
                  </div>
                ))}
                {daySeconds !== 86400 && (
                  <div className="flex items-start gap-2.5 text-xs text-amber-400/80">
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-[10px] font-bold text-amber-400">!</span>
                    <span>TEST MODE: Lock time scaled, rewards calculated by full days (min 1 day reward)</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Input Panel */}
          <div className="rounded-2xl border border-axion-border bg-axion-bg-secondary p-6">
            <h3 className="mb-4 text-base font-semibold text-white">Stake {plan.dayMultiplier} Day{plan.dayMultiplier > 1 ? "s" : ""}</h3>

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

            <div className="mb-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs text-axion-text-tertiary">Amount (BNB)</span>
                <span className="text-xs text-axion-text-muted">Balance: {parseFloat(balance || "0").toFixed(4)} BNB</span>
              </div>
              <div className="relative">
                <input type="number" value={amt} onChange={(e) => setAmt(e.target.value)} placeholder="0.00" min="0" step="0.001"
                  className="w-full rounded-xl border border-axion-border bg-axion-bg-tertiary px-4 py-3 text-lg font-tabular text-white outline-none transition-colors placeholder:text-axion-text-muted focus:border-brand" />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-white">BNB</span>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-xs text-axion-text-muted">Quick:</span>
                {[0.1, 0.5, 1, 5].map((q) => (
                  <button key={q} onClick={() => setAmt(q.toString())} className="rounded-md bg-axion-bg-tertiary px-2 py-0.5 text-xs text-axion-text-secondary transition-colors hover:bg-brand/10 hover:text-brand">{q} BNB</button>
                ))}
              </div>
            </div>

            {bnb > 0 && (
              <div className="mb-5 space-y-3 rounded-xl bg-axion-bg-tertiary p-4">
                <div className="flex items-center justify-between"><span className="text-xs text-axion-text-tertiary">Your Stake</span><span className="font-tabular text-sm text-white">{bnb.toFixed(4)} BNB</span></div>
                <div className="flex items-center justify-between"><span className="text-xs text-axion-text-tertiary">Daily Rate</span><span className="font-tabular text-sm text-brand">{plan.dailyRate}%</span></div>
                <div className="flex items-center justify-between"><span className="text-xs text-axion-text-tertiary">Lock Period</span><span className="font-tabular text-sm text-white">{periodLabel}</span></div>
                <div className="border-t border-axion-border pt-3">
                  <div className="flex items-center justify-between"><span className="text-xs text-axion-text-tertiary">Est. Reward</span><span className="font-tabular text-sm text-axion-success">+{rw.toFixed(6)} BNB</span></div>
                  <div className="mt-1 flex items-center justify-between"><span className="text-xs text-axion-text-tertiary">Total Return</span><span className="font-tabular text-sm font-semibold text-white">{(bnb + rw).toFixed(6)} BNB</span></div>
                </div>
              </div>
            )}

            <button onClick={doStake} disabled={!isConnected || bnb <= 0 || staking || loading || parseFloat(balance || "0") < bnb}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3.5 text-sm font-semibold text-white transition-all hover:bg-brand-light hover:shadow-brand-glow disabled:cursor-not-allowed disabled:opacity-50">
              {staking || loading ? "Processing..." : !isConnected ? "Connect Wallet to Stake" : isWrongNetwork ? "Switch Network" : bnb <= 0 ? "Enter Amount" : parseFloat(balance || "0") < bnb ? "Insufficient Balance" : <>Stake {bnb} BNB <ArrowRight className="h-4 w-4" /></>}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
