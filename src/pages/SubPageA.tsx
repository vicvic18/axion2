import { useLocation, Link } from "react-router";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Shield, FileText, Users, Sparkles, Lock, Globe, ChevronRight } from "lucide-react";

// Content sections for different routes
const contentMap: Record<string, {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  sections: { title: string; content: string }[];
}> = {
  "/governance": {
    title: "Governance",
    subtitle: "Participate in shaping the future of Axion Stake",
    icon: <Users className="h-6 w-6" />,
    sections: [
      { title: "Community-Driven Decisions", content: "Axion Stake is committed to decentralized governance. Stake holders can propose and vote on protocol parameters including reward rates, lock periods, and feature upgrades. Every 0.01 BNB staked earns you voting power proportional to your stake." },
      { title: "Proposal Process", content: "Submit proposals through our governance portal. Each proposal undergoes a 7-day discussion period followed by a 3-day voting window. Proposals passing with >50% approval are automatically queued for implementation." },
      { title: "Current Initiatives", content: "We are actively exploring cross-chain staking, dynamic reward mechanisms, and integration with DeFi protocols. Join our community channels to stay updated on upcoming votes and participate in protocol development." },
    ],
  },
  "/bug-bounty": {
    title: "Bug Bounty",
    subtitle: "Help secure Axion Stake and earn rewards",
    icon: <Shield className="h-6 w-6" />,
    sections: [
      { title: "Security First", content: "The security of our users' funds is our highest priority. We operate a comprehensive bug bounty program to identify and resolve vulnerabilities before they can be exploited." },
      { title: "Reward Tiers", content: "Critical vulnerabilities: up to $50,000 equivalent in BNB. High severity: up to $10,000. Medium severity: up to $2,000. Low severity: up to $500. Rewards are determined based on impact, exploitability, and report quality." },
      { title: "Scope & Rules", content: "In scope: smart contracts, frontend application, API endpoints. Out of scope: third-party dependencies, social engineering, DOS attacks on public endpoints. All reports must include proof of concept and reproduction steps." },
      { title: "How to Report", content: "Submit vulnerability reports via our dedicated security email or through the Immunefi bug bounty platform. We commit to initial response within 24 hours and full resolution within 14 days for critical issues." },
    ],
  },
  "/about": {
    title: "About Axion Stake",
    subtitle: "Secure staking on BNB Chain with industry-leading yields",
    icon: <Globe className="h-6 w-6" />,
    sections: [
      { title: "Our Mission", content: "Axion Stake provides a secure, transparent, and high-yield staking platform on BNB Chain. We believe in making DeFi accessible to everyone while maintaining the highest security standards for user funds." },
      { title: "Why Choose Axion", content: "Daily reward payouts with rates up to 1.52%. Tiered claim system protecting both small and large stakers. Two-level referral program with 1% L1 and 0.25% L2 commissions. Fully audited smart contracts with owner withdrawal safeguards." },
      { title: "Our Team", content: "Axion Stake is built by a team of blockchain developers, security researchers, and DeFi specialists with combined experience across Binance, Ethereum, and Cosmos ecosystems. We are committed to long-term sustainable yield generation." },
      { title: "Brand Guidelines", content: "Our brand color is Axion Blue (#1199FF), symbolizing trust and innovation. The Axion logo features the wordmark with a distinctive accent dot representing precision. When referencing Axion Stake, always include the full name on first mention." },
    ],
  },
  "/privacy": {
    title: "Privacy Policy",
    subtitle: "How we collect, use, and protect your data",
    icon: <Lock className="h-6 w-6" />,
    sections: [
      { title: "Information We Collect", content: "We collect public blockchain data including wallet addresses, transaction hashes, and staking positions. We do NOT collect private keys, seed phrases, or personal identification information. Our analytics are limited to aggregate usage patterns." },
      { title: "Data Usage", content: "Blockchain data is used to display your staking dashboard, calculate rewards, and process claims. Aggregate data helps us optimize gas costs and improve platform features. Referral codes are derived from your public wallet address." },
      { title: "Third Parties", content: "We use WalletConnect for wallet connections and BSC RPC nodes for blockchain data. No user data is sold or shared with advertisers. Analytics use anonymized, aggregated metrics only." },
      { title: "Your Rights", content: "You can disconnect your wallet at any time. All staking interactions are on-chain and immutable by design. For data inquiries, contact us through official community channels." },
    ],
  },
  "/terms": {
    title: "Terms of Service",
    subtitle: "Rules and guidelines for using Axion Stake",
    icon: <FileText className="h-6 w-6" />,
    sections: [
      { title: "Acceptance of Terms", content: "By connecting your wallet and using Axion Stake, you agree to these terms. Our platform is provided 'as is' without warranties. Smart contract interactions are irreversible - verify all transactions before confirming." },
      { title: "Staking Rules", content: "Minimum stake: determined by network gas economics. Lock periods are binding - early withdrawal is not available except through the unstake function after lock expiry. Reward rates are subject to change for new stakes; existing stakes maintain their locked rate." },
      { title: "Risk Disclosure", content: "Cryptocurrency staking involves risks including smart contract bugs, market volatility, and regulatory changes. Never stake more than you can afford to lose. Audit reports are available but do not guarantee complete security." },
      { title: "Prohibited Activities", content: "Users may not attempt to exploit smart contracts, manipulate reward mechanisms, or use the platform for money laundering. Violations may result in blacklisting from referral programs." },
    ],
  },
  "/disclaimer": {
    title: "Disclaimer",
    subtitle: "Important legal and risk information",
    icon: <Shield className="h-6 w-6" />,
    sections: [
      { title: "Not Financial Advice", content: "All information on Axion Stake is for informational purposes only and does not constitute financial advice. Consult a qualified financial advisor before making investment decisions." },
      { title: "No Guarantees", content: "Past performance does not indicate future results. Reward rates are variable and may change based on market conditions, protocol governance, and network parameters. Principal amounts are at risk." },
      { title: "Smart Contract Risk", content: "Despite professional audits, smart contracts may contain undiscovered vulnerabilities. By using Axion Stake, you acknowledge and accept these risks inherent in blockchain technology." },
      { title: "Regulatory Compliance", content: "Users are responsible for ensuring their use of Axion Stake complies with applicable laws in their jurisdiction. The platform does not serve users in sanctioned territories." },
    ],
  },
};

// Default / fallback content
export default function SubPageA() {
  const location = useLocation();
  const path = location.pathname;
  const data = contentMap[path] || contentMap["/about"];

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
          <div className="relative mx-auto max-w-[800px] px-6">
            {/* Logo */}
            <div className="mb-6 flex items-center gap-4">
              <img src="/logo.png" alt="Axion" className="h-14 w-14 rounded-full object-cover" />
              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
                  {data.title}
                </h1>
                <p className="text-sm text-axion-text-secondary">{data.subtitle}</p>
              </div>
            </div>

            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs text-axion-text-muted">
              <Link to="/" className="transition-colors hover:text-brand">Home</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-axion-text-tertiary">{data.title}</span>
            </nav>
          </div>
        </section>

        {/* Content */}
        <section className="bg-axion-bg-secondary pb-16 md:pb-20">
          <div className="mx-auto max-w-[800px] px-6">
            <div className="space-y-6">
              {data.sections.map((section, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-axion-border bg-axion-bg-tertiary p-6 transition-all hover:border-axion-border-hover"
                >
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/10">
                      <Sparkles className="h-4 w-4 text-brand" />
                    </div>
                    <h2 className="text-base font-semibold text-white">{section.title}</h2>
                  </div>
                  <p className="pl-11 text-sm leading-relaxed text-axion-text-secondary">
                    {section.content}
                  </p>
                </div>
              ))}
            </div>

            {/* Brand bar */}
            <div className="mt-10 flex items-center justify-center gap-3 rounded-2xl border border-axion-border bg-axion-bg-tertiary py-6">
              <img src="/logo.png" alt="Axion" className="h-8 w-8 rounded-full object-cover" />
              <span className="text-sm font-semibold tracking-tight text-white">AXION STAKE</span>
              <span className="text-xs text-axion-text-muted">&middot;</span>
              <span className="text-xs text-axion-text-muted">Secure. Transparent. Rewarding.</span>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
