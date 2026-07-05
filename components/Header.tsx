import { useState, useEffect } from "react";
import { Link } from "react-router";
import { useWallet } from "../context/WalletContext";
import WalletSelector from "./WalletSelector";
import { Menu, X, ChevronDown, Wallet, LogOut } from "lucide-react";

const navLinks = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Stake", href: "/staking" },
  { label: "Rewards", href: "/rewards" },
];

function truncateAddress(addr: string): string {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showSelector, setShowSelector] = useState(false);
  const [showDisconnect, setShowDisconnect] = useState(false);
  const { address, isConnected, isConnecting, error, connect, disconnect } = useWallet();

  const handleWalletSelect = async (walletId: string) => {
    await connect(walletId);
    setShowSelector(false);
  };

  // Listen for external "open-wallet-selector" events
  useEffect(() => {
    const onOpen = () => setShowSelector(true);
    window.addEventListener("open-wallet-selector" as any, onOpen);
    return () => window.removeEventListener("open-wallet-selector" as any, onOpen);
  }, []);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-axion-border bg-[#0A0A0A]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-full max-w-[1200px] items-center justify-between px-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
            <img src="/logo.png" alt="Axion" className="h-8 w-8 rounded-full object-cover" />
            <span className="text-lg font-semibold tracking-tight text-white">
              Axion Stake
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="rounded-lg px-4 py-2 text-sm font-medium text-axion-text-secondary transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="hidden items-center gap-3 md:flex">
            <button className="flex items-center gap-2 rounded-lg border border-axion-border bg-axion-bg-tertiary px-3 py-2 text-sm font-medium text-white transition-colors hover:border-axion-border-hover">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-axion-success opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-axion-success"></span>
              </span>
              Mainnet
              <ChevronDown className="h-4 w-4 text-axion-text-tertiary" />
            </button>

            {isConnected && address ? (
              <div className="relative">
                <button
                  onClick={() => setShowDisconnect(!showDisconnect)}
                  className="flex items-center gap-2 rounded-lg border border-axion-border bg-axion-bg-tertiary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:border-axion-border-hover"
                >
                  <span className="h-2.5 w-2.5 rounded-full bg-brand"></span>
                  {truncateAddress(address)}
                  <ChevronDown className="h-4 w-4 text-axion-text-tertiary" />
                </button>

                {showDisconnect && (
                  <div className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-lg border border-axion-border bg-axion-bg-elevated shadow-card-hover">
                    <div className="border-b border-axion-border px-4 py-3">
                      <p className="text-xs text-axion-text-tertiary">Connected</p>
                      <p className="mt-0.5 font-mono text-xs text-white break-all">
                        {address}
                      </p>
                    </div>
                    <button
                      onClick={() => { disconnect(); setShowDisconnect(false); }}
                      className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-axion-text-secondary transition-colors hover:bg-axion-bg-tertiary hover:text-white"
                    >
                      <LogOut className="h-4 w-4" />
                      Disconnect
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowSelector(true)}
                className="flex items-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-brand-light hover:shadow-brand-glow"
              >
                <Wallet className="h-4 w-4" />
                Connect Wallet
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="flex h-10 w-10 items-center justify-center rounded-lg text-white md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="border-b border-axion-border bg-[#0A0A0A]/95 backdrop-blur-xl md:hidden">
            <nav className="flex flex-col gap-1 px-6 py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-4 py-3 text-sm font-medium text-axion-text-secondary transition-colors hover:bg-axion-bg-tertiary hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-3 flex flex-col gap-3 border-t border-axion-border pt-4">
                {isConnected && address ? (
                  <div className="rounded-lg border border-axion-border bg-axion-bg-tertiary">
                    <div className="flex items-center gap-2 px-3 py-2.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-brand"></span>
                      <span className="font-mono text-sm text-white">{truncateAddress(address)}</span>
                    </div>
                    <button
                      onClick={() => { disconnect(); setMobileOpen(false); }}
                      className="flex w-full items-center gap-2 border-t border-axion-border px-3 py-2.5 text-sm text-axion-text-secondary transition-colors hover:text-white"
                    >
                      <LogOut className="h-4 w-4" />
                      Disconnect
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => { setShowSelector(true); setMobileOpen(false); }}
                    className="flex items-center justify-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white"
                  >
                    <Wallet className="h-4 w-4" />
                    Connect Wallet
                  </button>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>

      <WalletSelector
        isOpen={showSelector}
        onClose={() => setShowSelector(false)}
        onSelect={handleWalletSelect}
        isConnecting={isConnecting}
        error={error}
      />
    </>
  );
}
