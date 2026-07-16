import Header from "../components/Header";
import Footer from "../components/Footer";
import {
  Clock,
  TrendingUp,
  Lock,
  Users,
  Coins,
  Shield,
  ChevronRight,
  AlertTriangle,
  Timer,
  Wallet,
  Link as RouterLink,
} from "lucide-react";

function SectionCard({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-axion-border bg-axion-bg-tertiary p-6 transition-all hover:border-axion-border-hover">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10">{icon}</div>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>
      <div className="text-sm leading-relaxed text-axion-text-secondary">{children}</div>
    </div>
  );
}

function InfoRow({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between border-b border-axion-border/50 py-3 last:border-0">
      <span className="text-xs text-axion-text-tertiary">{label}</span>
      <span className={`font-tabular text-sm font-medium ${highlight ? "text-brand" : "text-white"}`}>{value}</span>
    </div>
  );
}

export default function SubPageB() {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <Header />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-[#0A0A0A] pt-28 pb-12 md:pt-32">
          <div
            className="pointer-events-none absolute -top-32 -right-32 h-[500px] w-[500px] rounded-full opacity-20 blur-3xl"
            style={{ background: "radial-gradient(circle, rgba(17,153,255,0.25) 0%, transparent 70%)" }}
          />
          <div className="pointer-events-none absolute top-1/2 -left-48 h-[400px] w-[400px] rounded-full opacity-10 blur-3xl"
            style={{ background: "radial-gradient(circle, rgba(17,153,255,0.2) 0%, transparent 70%)" }}
          />
          <div className="relative mx-auto max-w-[900px] px-6">
            <div className="mb-6 flex items-center gap-4">
              <img src="/logo.png" alt="Axion" className="h-14 w-14 rounded-full object-cover" />
              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
                  Documentation
                </h1>
                <p className="text-sm text-axion-text-secondary">
                  Everything you need to know about staking and referrals
                </p>
              </div>
            </div>
            <nav className="flex items-center gap-2 text-xs text-axion-text-muted">
              <RouterLink to="/" className="transition-colors hover:text-brand">Home</RouterLink>
              <ChevronRight className="h-3 w-3" />
              <span className="text-axion-text-tertiary">Documentation</span>
            </nav>
          </div>
        </section>

        {/* ====== TRIAL STAKING SECTION ====== */}
        <section className="bg-axion-bg-secondary py-12">
          <div className="mx-auto max-w-[900px] px-6">
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10">
                <Lock className="h-5 w-5 text-brand" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-white">Trial Staking</h2>
                <p className="text-xs text-axion-text-muted">Lock BNB, earn daily rewards, claim on maturity</p>
              </div>
            </div>

            <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Plan 1 */}
              <div className="rounded-2xl border border-brand/30 bg-brand/5 p-5">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: "#1199FF15" }}>
                    <Clock className="h-5 w-5" style={{ color: "#1199FF" }} />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-white">1-Day Plan</h3>
                    <p className="text-xs text-axion-text-muted">Short-term lock</p>
                  </div>
                </div>
                <div className="mb-4 space-y-2">
                  <InfoRow label="Daily Reward Rate" value="1.26%" highlight />
                  <InfoRow label="Lock Period" value="1 day (86400 seconds)" />
                  <InfoRow label="Min. Stake" value="0.001 BNB (gas-dependent)" />
                  <InfoRow label="Reward Formula" value="P × 126 × 1 / 10000" />
                </div>
                <div className="rounded-xl bg-axion-bg-tertiary p-3">
                  <p className="text-xs text-axion-text-secondary">
                    <span className="font-semibold text-brand">Example:</span> Stake 1 BNB for 1 day → earn 0.013 BNB reward. Total return: 1.013 BNB.
                  </p>
                </div>
              </div>

              {/* Plan 7 */}
              <div className="rounded-2xl border border-green-500/30 bg-green-500/5 p-5">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: "#22C55E15" }}>
                    <TrendingUp className="h-5 w-5" style={{ color: "#22C55E" }} />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-white">7-Day Plan</h3>
                    <p className="text-xs text-axion-text-muted">Higher yield lock</p>
                  </div>
                </div>
                <div className="mb-4 space-y-2">
                  <InfoRow label="Daily Reward Rate" value="1.48%" highlight />
                  <InfoRow label="Lock Period" value="7 days (604800 seconds)" />
                  <InfoRow label="Min. Stake" value="0.001 BNB (gas-dependent)" />
                  <InfoRow label="Reward Formula" value="P × 148 × 7 / 10000" />
                </div>
                <div className="rounded-xl bg-axion-bg-tertiary p-3">
                  <p className="text-xs text-axion-text-secondary">
                    <span className="font-semibold text-green-400">Example:</span> Stake 1 BNB for 7 days → earn 0.1064 BNB reward. Total return: 1.1064 BNB.
                  </p>
                </div>
              </div>
            </div>

            {/* How It Works */}
            <SectionCard icon={<Timer className="h-5 w-5 text-brand" />} title="How Trial Staking Works">
              <div className="space-y-4">
                <div className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand/15 text-[10px] font-bold text-brand">1</span>
                  <p><span className="font-medium text-white">Choose a plan</span> — Select either 1-Day (1.26%/day) or 7-Day (1.48%/day) based on your preference.</p>
                </div>
                <div className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand/15 text-[10px] font-bold text-brand">2</span>
                  <p><span className="font-medium text-white">Stake BNB</span> — Enter the amount and confirm the transaction. Your BNB is locked in the smart contract and starts earning immediately.</p>
                </div>
                <div className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand/15 text-[10px] font-bold text-brand">3</span>
                  <p><span className="font-medium text-white">Earn daily</span> — Rewards accrue based on the daily rate and lock period. The rate is locked at stake time.</p>
                </div>
                <div className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand/15 text-[10px] font-bold text-brand">4</span>
                  <p><span className="font-medium text-white">Claim on maturity</span> — After the lock period ends, claim your principal + reward. Small stakes (≤0.29 BNB) receive full return; large stakes receive reward only.</p>
                </div>
              </div>
            </SectionCard>


          </div>
        </section>

        {/* Divider */}
        <div className="bg-axion-bg-secondary">
          <div className="mx-auto max-w-[900px] px-6">
            <div className="border-t border-axion-border" />
          </div>
        </div>

        {/* ====== REFERRAL PROGRAM SECTION ====== */}
        <section className="bg-axion-bg-secondary py-12">
          <div className="mx-auto max-w-[900px] px-6">
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10">
                <Users className="h-5 w-5 text-brand" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-white">Referral Program</h2>
                <p className="text-xs text-axion-text-muted">Earn commissions by inviting friends to stake</p>
              </div>
            </div>

            {/* Commission Structure */}
            <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              <SectionCard icon={<Users className="h-5 w-5 text-brand" />} title="Level 1 — Direct Referral">
                <div className="space-y-3">
                  <p>When someone stakes using your referral link, you earn <span className="font-semibold text-brand">1%</span> of their stake amount.</p>
                  <div className="rounded-xl bg-axion-bg-secondary p-3">
                    <p className="text-xs text-axion-text-secondary">
                      <span className="font-semibold text-white">Example:</span> Your friend stakes 10 BNB → You earn 0.10 BNB commission instantly.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-axion-text-muted">
                    <Shield className="h-3 w-3" />
                    <span>Requires you to have staked ≥ 0.01 BNB to be eligible</span>
                  </div>
                </div>
              </SectionCard>

              <SectionCard icon={<Users className="h-5 w-5 text-axion-success" />} title="Level 2 — Team Referral">
                <div className="space-y-3">
                  <p>When your direct referral invites someone who stakes, you earn <span className="font-semibold text-axion-success">0.25%</span> of that stake amount.</p>
                  <div className="rounded-xl bg-axion-bg-secondary p-3">
                    <p className="text-xs text-axion-text-secondary">
                      <span className="font-semibold text-white">Example:</span> Your friend's friend stakes 10 BNB → You earn 0.025 BNB.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-axion-text-muted">
                    <Shield className="h-3 w-3" />
                    <span>Same eligibility: ≥ 0.01 BNB staked</span>
                  </div>
                </div>
              </SectionCard>
            </div>

            {/* How It Works */}
            <SectionCard icon={<Coins className="h-5 w-5 text-brand" />} title="How the Referral Program Works">
              <div className="space-y-4">
                <div className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand/15 text-[10px] font-bold text-brand">1</span>
                  <p><span className="font-medium text-white">Stake at least 0.01 BNB</span> — This unlocks your unique referral link. Without a qualifying stake, your link is inactive.</p>
                </div>
                <div className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand/15 text-[10px] font-bold text-brand">2</span>
                  <p><span className="font-medium text-white">Share your link</span> — Copy your referral link from the Dashboard and share it with friends, on social media, or in your community.</p>
                </div>
                <div className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand/15 text-[10px] font-bold text-brand">3</span>
                  <p><span className="font-medium text-white">Friends stake BNB</span> — When someone clicks your link and stakes, the contract automatically records them as your L1 referral.</p>
                </div>
                <div className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand/15 text-[10px] font-bold text-brand">4</span>
                  <p><span className="font-medium text-white">Earn commissions</span> — 1% on direct stakes, 0.25% on indirect stakes. Commissions are credited to your claimable balance instantly.</p>
                </div>
                <div className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand/15 text-[10px] font-bold text-brand">5</span>
                  <p><span className="font-medium text-white">Claim anytime</span> — Commission balances accumulate and can be claimed whenever you choose. No lock period on referral earnings.</p>
                </div>
              </div>
            </SectionCard>

            {/* Summary Table */}
            <div className="mt-4">
              <SectionCard icon={<Wallet className="h-5 w-5 text-brand" />} title="Quick Reference">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-axion-border">
                        <th className="py-3 pr-4 text-left text-xs font-medium text-axion-text-tertiary">Feature</th>
                        <th className="py-3 pr-4 text-left text-xs font-medium text-axion-text-tertiary">1-Day Plan</th>
                        <th className="py-3 pr-4 text-left text-xs font-medium text-axion-text-tertiary">7-Day Plan</th>
                        <th className="py-3 text-left text-xs font-medium text-axion-text-tertiary">Referral</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-axion-border/50">
                        <td className="py-3 pr-4 text-xs text-white">Rate</td>
                        <td className="py-3 pr-4 font-tabular text-xs text-brand">1.26%/day</td>
                        <td className="py-3 pr-4 font-tabular text-xs text-green-400">1.48%/day</td>
                        <td className="py-3 font-tabular text-xs text-axion-success">1% / 0.25%</td>
                      </tr>
                      <tr className="border-b border-axion-border/50">
                        <td className="py-3 pr-4 text-xs text-white">Lock</td>
                        <td className="py-3 pr-4 text-xs text-axion-text-secondary">1 day</td>
                        <td className="py-3 pr-4 text-xs text-axion-text-secondary">7 days</td>
                        <td className="py-3 text-xs text-axion-text-secondary">No lock</td>
                      </tr>
                      <tr className="border-b border-axion-border/50">
                        <td className="py-3 pr-4 text-xs text-white">Min. Stake</td>
                        <td className="py-3 pr-4 text-xs text-axion-text-secondary">0.001 BNB</td>
                        <td className="py-3 pr-4 text-xs text-axion-text-secondary">0.001 BNB</td>
                        <td className="py-3 text-xs text-axion-text-secondary">0.01 BNB (to activate)</td>
                      </tr>
                      <tr>
                        <td className="py-3 pr-4 text-xs text-white">Claim</td>
                        <td className="py-3 pr-4 text-xs text-axion-text-secondary">After lock</td>
                        <td className="py-3 pr-4 text-xs text-axion-text-secondary">After lock</td>
                        <td className="py-3 text-xs text-axion-success">Anytime</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </SectionCard>
            </div>

            {/* Warning */}
            <div className="mt-6 flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
              <div>
                <p className="mb-1 text-xs font-semibold text-amber-400">Important Notice</p>
                <p className="text-xs leading-relaxed text-amber-200/70">
                  Reward rates are locked at the time of staking for the full duration of your lock period. Rates displayed here apply to new stakes only and are subject to change via governance. Always verify current rates before staking. Referral commissions are paid from the stake amount at the time of staking.
                </p>
              </div>
            </div>

            {/* Brand bar */}
            <div className="mt-10 flex items-center justify-center gap-3 rounded-2xl border border-axion-border bg-axion-bg-tertiary py-6">
              <img src="/logo.png" alt="Axion" className="h-8 w-8 rounded-full object-cover" />
              <span className="text-sm font-semibold tracking-tight text-white">AXION STAKE</span>
              <span className="text-xs text-axion-text-muted">&middot;</span>
              <span className="text-xs text-axion-text-muted">Stake Smart. Earn Daily.</span>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
