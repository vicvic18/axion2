import { useCountUp } from "../hooks/useCountUp";
import { Lock, Users, TrendingUp } from "lucide-react";

export default function HeroSection() {
  const totalStaked = useCountUp(128921, 1500, 0);
  const validatorsActive = 45;
  const validatorsTotal = 53;
  const apyValue = useCountUp(1.30, 1500, 2);

  return (
    <section
      id="dashboard"
      className="relative overflow-hidden bg-[#0A0A0A] pt-28 pb-16 md:pt-32 md:pb-20"
    >
      {/* Background glow */}
      <div
        className="pointer-events-none absolute -top-32 -right-32 h-[500px] w-[500px] rounded-full opacity-20 blur-3xl md:h-[600px] md:w-[600px]"
        style={{
          background: "radial-gradient(circle, rgba(17,153,255,0.25) 0%, transparent 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute top-1/2 -left-48 h-[400px] w-[400px] rounded-full opacity-10 blur-3xl"
        style={{
          background: "radial-gradient(circle, rgba(17,153,255,0.2) 0%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto flex max-w-[1200px] flex-col gap-12 px-6 lg:flex-row lg:items-center lg:gap-16">
        {/* Left side - Text */}
        <div className="flex-1 animate-fade-in-up">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-axion-success-glow px-3 py-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-axion-success opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-axion-success"></span>
            </span>
            <span className="text-xs font-semibold tracking-wide text-axion-success uppercase">
              Mainnet
            </span>
          </div>

          <h1 className="mb-4 text-4xl font-semibold leading-tight tracking-tight text-white md:text-5xl">
            AXION <span className="text-brand">STAKE</span>
          </h1>

          <p className="max-w-lg text-base leading-relaxed text-axion-text-secondary md:text-lg">
            Secure the BNB Chain network & earn rewards by staking BNB with Axion validator.
          </p>
        </div>

        {/* Right side - Stats cards */}
        <div className="flex w-full flex-col gap-4 lg:w-[400px]">
          {/* Total BNB Staked */}
          <div className="animate-fade-in-up stagger-3 rounded-2xl border border-axion-border bg-axion-bg-secondary p-5 transition-all hover:border-axion-border-hover">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-axion-bg-tertiary">
                <Lock className="h-4.5 w-4.5 text-brand" />
              </div>
              <span className="text-xs font-medium text-axion-text-tertiary">
                Total BNB Staked
              </span>
            </div>
            <p className="font-tabular text-2xl font-bold text-white md:text-3xl">
              {totalStaked.toLocaleString()}{" "}
              <span className="text-lg font-semibold text-axion-text-secondary">BNB</span>
            </p>
          </div>

          {/* Validators */}
          <div className="animate-fade-in-up stagger-4 rounded-2xl border border-axion-border bg-axion-bg-secondary p-5 transition-all hover:border-axion-border-hover">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-axion-bg-tertiary">
                <Users className="h-4.5 w-4.5 text-brand" />
              </div>
              <span className="text-xs font-medium text-axion-text-tertiary">Validators</span>
            </div>
            <p className="font-tabular text-2xl font-bold text-white md:text-3xl">
              {validatorsActive}{" "}
              <span className="text-lg font-semibold text-axion-text-secondary">
                / {validatorsTotal}
              </span>
            </p>
          </div>

          {/* APY */}
          <div className="animate-fade-in-up stagger-5 rounded-2xl border border-axion-border bg-axion-bg-secondary p-5 transition-all hover:border-axion-border-hover">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-axion-bg-tertiary">
                <TrendingUp className="h-4.5 w-4.5 text-brand" />
              </div>
              <span className="text-xs font-medium text-axion-text-tertiary">APY</span>
            </div>
            <p className="font-tabular text-2xl font-bold text-white md:text-3xl">
              Up to {apyValue}%
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
