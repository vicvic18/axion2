import { useState } from "react";
import { validatorDetail } from "../data/mockData";
import {
  Lock,
  TrendingUp,
  Receipt,
  Copy,
  Check,
  ExternalLink,
} from "lucide-react";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="ml-2 inline-flex items-center text-axion-text-muted transition-colors hover:text-brand"
      title="Copy address"
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-axion-success" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
    </button>
  );
}

function AddressLink({ address, fullAddress }: { address: string; fullAddress: string }) {
  return (
    <div className="flex items-center">
      <a
        href={`https://bscscan.com/address/${fullAddress}`}
        target="_blank"
        rel="noopener noreferrer"
        className="font-mono text-sm text-brand transition-colors hover:text-brand-light hover:underline"
      >
        {address}
      </a>
      <CopyButton text={fullAddress} />
      <a
        href={`https://bscscan.com/address/${fullAddress}`}
        target="_blank"
        rel="noopener noreferrer"
        className="ml-1.5 text-axion-text-muted transition-colors hover:text-axion-text-secondary"
      >
        <ExternalLink className="h-3.5 w-3.5" />
      </a>
    </div>
  );
}

export default function ValidatorDetailSection() {
  return (
    <section className="bg-axion-bg-secondary py-16 md:py-20">
      <div className="mx-auto max-w-[1200px] px-6">
        {/* Validator Header Card */}
        <div className="animate-fade-in-up stagger-1 mb-6 rounded-2xl border border-axion-border bg-axion-bg-tertiary p-5 md:p-6">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-4">
              <img
                src="/logo.png"
                alt="Axion"
                className="h-12 w-12 rounded-full object-cover"
              />
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-semibold text-white md:text-3xl">
                  {validatorDetail.name}
                </h2>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-axion-success-glow px-2.5 py-1 text-xs font-semibold text-axion-success">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-axion-success opacity-75"></span>
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-axion-success"></span>
                  </span>
                  Active
                </span>
              </div>
            </div>
            <button className="w-full rounded-lg bg-brand px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-brand-light hover:shadow-brand-glow sm:w-auto">
              Delegate
            </button>
          </div>
        </div>

        {/* Stats Cards Row */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Total BNB Staked */}
          <div className="animate-fade-in-up stagger-2 rounded-2xl border border-axion-border bg-axion-bg-tertiary p-5 transition-all hover:border-axion-border-hover">
            <div className="mb-3 flex items-center gap-2">
              <Lock className="h-4 w-4 text-axion-text-muted" />
              <span className="text-xs font-medium text-axion-text-tertiary">
                Total BNB Staked
              </span>
            </div>
            <p className="font-tabular text-xl font-semibold text-white md:text-2xl">
              {validatorDetail.totalStaked}{" "}
              <span className="text-sm font-normal text-axion-text-secondary">
                BNB
              </span>
            </p>
            <p className="mt-1 text-xs text-axion-text-muted">
              ({validatorDetail.stakedPercent})
            </p>
          </div>

          {/* APY */}
          <div className="animate-fade-in-up stagger-3 rounded-2xl border border-axion-border bg-axion-bg-tertiary p-5 transition-all hover:border-axion-border-hover">
            <div className="mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-axion-text-muted" />
              <span className="text-xs font-medium text-axion-text-tertiary">APY</span>
            </div>
            <p className="font-tabular text-xl font-semibold text-white md:text-2xl">
              {validatorDetail.apy}
            </p>
          </div>

          {/* Commission */}
          <div className="animate-fade-in-up stagger-4 rounded-2xl border border-axion-border bg-axion-bg-tertiary p-5 transition-all hover:border-axion-border-hover">
            <div className="mb-3 flex items-center gap-2">
              <Receipt className="h-4 w-4 text-axion-text-muted" />
              <span className="text-xs font-medium text-axion-text-tertiary">
                Commission
              </span>
            </div>
            <p className="font-tabular text-xl font-semibold text-white md:text-2xl">
              {validatorDetail.commission}
            </p>
          </div>
        </div>

        {/* Detail Info Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Left Column */}
          <div className="animate-fade-in-up stagger-5 rounded-2xl border border-axion-border bg-axion-bg-tertiary p-5">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-axion-text-tertiary">Operate Since</span>
                <span className="text-sm text-white">{validatorDetail.operateSince}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-axion-text-tertiary">Type</span>
                <span className="inline-flex rounded-full bg-white/5 px-2.5 py-0.5 text-xs font-medium text-axion-text-secondary">
                  {validatorDetail.type}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-axion-text-tertiary">Website</span>
                <span className="text-sm text-axion-text-muted">
                  {validatorDetail.website}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-axion-text-tertiary">
                  Self Delegation
                </span>
                <span className="font-tabular text-sm text-white">
                  {validatorDetail.selfDelegation}{" "}
                  <span className="text-axion-text-secondary">BNB</span>
                </span>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="animate-fade-in-up stagger-6 rounded-2xl border border-axion-border bg-axion-bg-tertiary p-5">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-axion-text-tertiary">Delegators</span>
                <span className="font-tabular text-sm text-white">
                  {validatorDetail.delegators}
                </span>
              </div>
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-xs text-axion-text-tertiary shrink-0">
                  Operator Address
                </span>
                <AddressLink
                  address={validatorDetail.operatorAddress}
                  fullAddress={validatorDetail.operatorAddressFull}
                />
              </div>
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-xs text-axion-text-tertiary shrink-0">
                  Consensus Address
                </span>
                <AddressLink
                  address={validatorDetail.consensusAddress}
                  fullAddress={validatorDetail.consensusAddressFull}
                />
              </div>
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-xs text-axion-text-tertiary shrink-0">
                  Vote Address
                </span>
                <div className="flex items-center">
                  <span className="font-mono text-sm text-axion-text-secondary">
                    {validatorDetail.voteAddress}
                  </span>
                  <CopyButton text={validatorDetail.voteAddressFull} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
