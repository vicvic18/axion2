import { useState } from "react";
import { useCountUp } from "../hooks/useCountUp";
import { validatorDetail } from "../data/mockData";
import {
  Lock,
  Users,
  TrendingUp,
  Copy,
  Check,
  ExternalLink,
  Receipt,
  Calendar,
  Wallet,
  ArrowUpRight,
} from "lucide-react";

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={handleCopy} className="ml-1.5 inline-flex items-center text-axion-text-muted transition-colors hover:text-brand">
      {copied ? <Check className="h-3.5 w-3.5 text-axion-success" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  );
}

export default function OverviewSection() {
  const totalStaked = useCountUp(128921, 1500, 0);
  const validatorsActive = 45;
  const validatorsTotal = 53;
  const apyValue = useCountUp(1.30, 1500, 2);

  return (
    <section id="overview" className="relative overflow-hidden bg-[#0A0A0A] pt-28 pb-8 md:pt-32 md:pb-12">
      {/* Background glow */}
      <div
        className="pointer-events-none absolute -top-32 -right-32 h-[500px] w-[500px] rounded-full opacity-20 blur-3xl md:h-[600px] md:w-[600px]"
        style={{ background: "radial-gradient(circle, rgba(17,153,255,0.25) 0%, transparent 70%)" }}
      />
      <div
        className="pointer-events-none absolute top-1/2 -left-48 h-[400px] w-[400px] rounded-full opacity-10 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(17,153,255,0.2) 0%, transparent 70%)" }}
      />

      <div className="relative mx-auto max-w-[1200px] px-6">
        {/* === Hero Row === */}
        <div className="mb-8 flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-12">
          {/* Left: Title + Stats Cards */}
          <div className="flex-1">
            {/* Mainnet badge */}
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-axion-success-glow px-3 py-1.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-axion-success opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-axion-success" />
              </span>
              <span className="text-xs font-semibold tracking-wide text-axion-success uppercase">Mainnet</span>
            </div>

            <h1 className="mb-3 text-4xl font-semibold leading-tight tracking-tight text-white md:text-5xl">
              AXION <span className="text-brand">STAKE</span>
            </h1>
            <p className="mb-6 max-w-lg text-base leading-relaxed text-axion-text-secondary md:text-lg">
              Secure the BNB Chain network & earn rewards by staking BNB with Axion validator.
            </p>

            {/* Delegate on Binance Button */}
            <a
              href="https://www.bnbchain.org/en/bnb-staking/validator/0xC1DA8b99674137CC4971bF974cdC5157c8B86AaF"
              target="_blank"
              rel="noopener noreferrer"
              className="mb-6 inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-brand-light hover:shadow-brand-glow"
            >
              <Wallet className="h-4 w-4" />
              Delegate on Binance
              <ArrowUpRight className="h-4 w-4" />
            </a>

            {/* 3 Stat Cards */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-axion-border bg-axion-bg-secondary p-4">
                <div className="mb-2 flex items-center gap-2">
                  <Lock className="h-4 w-4 text-brand" />
                  <span className="text-xs text-axion-text-tertiary">Total BNB Staked</span>
                </div>
                <p className="font-tabular text-2xl font-bold text-white">{totalStaked.toLocaleString()} <span className="text-base font-normal text-axion-text-secondary">BNB</span></p>
              </div>
              <div className="rounded-2xl border border-axion-border bg-axion-bg-secondary p-4">
                <div className="mb-2 flex items-center gap-2">
                  <Users className="h-4 w-4 text-brand" />
                  <span className="text-xs text-axion-text-tertiary">Validators</span>
                </div>
                <p className="font-tabular text-2xl font-bold text-white">{validatorsActive} <span className="text-base font-normal text-axion-text-secondary">/ {validatorsTotal}</span></p>
              </div>
              <div className="rounded-2xl border border-axion-border bg-axion-bg-secondary p-4">
                <div className="mb-2 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-brand" />
                  <span className="text-xs text-axion-text-tertiary">APY</span>
                </div>
                <p className="font-tabular text-2xl font-bold text-white">Up to {apyValue}%</p>
              </div>
            </div>
          </div>

          {/* Right: Validator Card + Logo */}
          <div className="w-full lg:w-[380px]">
            {/* Logo + Name */}
            <div className="mb-4 flex items-center gap-4">
              <img src="/logo.png" alt="Axion" className="h-16 w-16 rounded-full object-cover md:h-20 md:w-20" />
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-semibold text-white">{validatorDetail.name}</h2>
                  <span className="inline-flex items-center gap-1 rounded-full bg-axion-success-glow px-2 py-0.5 text-xs font-semibold text-axion-success">
                    <span className="relative flex h-1.5 w-1.5"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-axion-success opacity-75" /><span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-axion-success" /></span>
                    Active
                  </span>
                </div>
                <p className="text-xs text-axion-text-muted">{validatorDetail.type} Validator &middot; Since {validatorDetail.operateSince}</p>
              </div>
            </div>

            {/* Validator Stats */}
            <div className="rounded-2xl border border-axion-border bg-axion-bg-secondary p-5">
              <div className="mb-4 grid grid-cols-3 gap-3">
                <div className="text-center">
                  <p className="font-tabular text-lg font-semibold text-white">{validatorDetail.totalStaked} <span className="text-xs text-axion-text-secondary">BNB</span></p>
                  <p className="text-[10px] text-axion-text-muted">Staked ({validatorDetail.stakedPercent})</p>
                </div>
                <div className="text-center">
                  <p className="font-tabular text-lg font-semibold text-white">{validatorDetail.apy}</p>
                  <p className="text-[10px] text-axion-text-muted">APY</p>
                </div>
                <div className="text-center">
                  <p className="font-tabular text-lg font-semibold text-white">{validatorDetail.commission}</p>
                  <p className="text-[10px] text-axion-text-muted">Commission</p>
                </div>
              </div>

              {/* Detail rows */}
              <div className="space-y-2.5 border-t border-axion-border pt-4">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs text-axion-text-tertiary"><Receipt className="h-3 w-3" />Self Delegation</span>
                  <span className="font-tabular text-xs text-white">{validatorDetail.selfDelegation} BNB</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs text-axion-text-tertiary"><Users className="h-3 w-3" />Delegators</span>
                  <span className="font-tabular text-xs text-white">{validatorDetail.delegators}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs text-axion-text-tertiary"><Calendar className="h-3 w-3" />Operate Since</span>
                  <span className="text-xs text-white">{validatorDetail.operateSince}</span>
                </div>
              </div>

              {/* Addresses */}
              <div className="mt-3 space-y-1.5 border-t border-axion-border pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-axion-text-muted">Operator</span>
                  <div className="flex items-center">
                    <a href={`https://bscscan.com/address/${validatorDetail.operatorAddressFull}`} target="_blank" rel="noopener noreferrer" className="font-mono text-[10px] text-brand hover:underline">{validatorDetail.operatorAddress}</a>
                    <CopyBtn text={validatorDetail.operatorAddressFull} />
                    <a href={`https://bscscan.com/address/${validatorDetail.operatorAddressFull}`} target="_blank" rel="noopener noreferrer" className="ml-1 text-axion-text-muted"><ExternalLink className="h-3 w-3" /></a>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-axion-text-muted">Consensus</span>
                  <div className="flex items-center">
                    <a href={`https://bscscan.com/address/${validatorDetail.consensusAddressFull}`} target="_blank" rel="noopener noreferrer" className="font-mono text-[10px] text-brand hover:underline">{validatorDetail.consensusAddress}</a>
                    <CopyBtn text={validatorDetail.consensusAddressFull} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
