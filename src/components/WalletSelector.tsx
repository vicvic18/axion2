import { useMemo } from "react";
import { X, AlertCircle, Wallet, QrCode } from "lucide-react";

interface WalletSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (walletId: string) => void;
  isConnecting: boolean;
  error: string | null;
}

function getCurrentUrl(): string {
  if (typeof window === "undefined") return "";
  return encodeURIComponent(window.location.href);
}

function isMobile(): boolean {
  if (typeof window === "undefined") return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    window.navigator.userAgent
  );
}

function hasInjectedProvider(): boolean {
  if (typeof window === "undefined") return false;
  return !!window.ethereum;
}

interface WalletOption {
  id: string;
  name: string;
  description: string;
  logo: string;
  popular?: boolean;
  deepLink?: string;
}

export default function WalletSelector({
  isOpen,
  onClose,
  onSelect,
  isConnecting,
  error,
}: WalletSelectorProps) {
  const _isMobile = useMemo(() => isMobile(), []);
  const _hasInjected = useMemo(() => hasInjectedProvider(), []);
  const currentUrl = useMemo(() => getCurrentUrl(), []);

  // Desktop: always show all wallets for injected connection
  // Mobile with injected provider: same as desktop
  // Mobile without injected provider: show deep links for MetaMask/Trust
  const showDeepLinks = _isMobile && !_hasInjected;

  const walletOptions: WalletOption[] = [
    {
      id: "metamask",
      name: "MetaMask",
      description: _hasInjected
        ? "Connect to your MetaMask wallet"
        : "Open in MetaMask app",
      logo: "/wallets/metamask.png",
      popular: true,
      deepLink: `https://metamask.app.link/dapp/${window.location.host}`,
    },
    {
      id: "trust",
      name: "Trust Wallet",
      description: _hasInjected
        ? "Connect to your Trust Wallet"
        : "Open in Trust Wallet app",
      logo: "/wallets/trust.png",
      deepLink: `https://link.trustwallet.com/open_url?coin_id=20000714&url=${encodeURIComponent(window.location.href)}`,
    },
    {
      id: "binance",
      name: "Binance Web3 Wallet",
      description: "Connect to Binance Wallet",
      logo: "/wallets/binance.png",
      deepLink: `bnc://app.binance.com/cedefi/wallet?url=${currentUrl}`,
    },
    {
      id: "walletconnect",
      name: "WalletConnect",
      description: "Scan with any wallet",
      logo: "/wallets/walletconnect.png",
    },
  ];

  if (!isOpen) return null;

  const handleWalletClick = (option: WalletOption) => {
    if (showDeepLinks && option.deepLink && option.id !== "walletconnect") {
      // Mobile without injected provider → open deep link
      window.location.href = option.deepLink;
      return;
    }
    // Desktop or has injected provider → normal connect flow
    onSelect(option.id);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-[380px] overflow-hidden rounded-2xl border border-axion-border bg-axion-bg-elevated shadow-card-hover">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4">
          <h3 className="text-base font-semibold text-white">Connect Wallet</h3>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-axion-text-tertiary transition-colors hover:bg-axion-bg-tertiary hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="mx-4 mb-3 flex items-start gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2.5">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
            <p className="text-xs text-red-300">{error}</p>
          </div>
        )}

        {/* Mobile notice */}
        {showDeepLinks && (
          <div className="mx-4 mb-3 flex items-start gap-2 rounded-lg border border-blue-500/20 bg-blue-500/10 px-3 py-2.5">
            <Wallet className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" />
            <p className="text-xs text-blue-300">
              Tap a wallet to open it directly. Make sure the wallet app is installed.
            </p>
          </div>
        )}

        {/* Wallet Options */}
        <div className="px-3 pb-4">
          <p className="mb-3 px-2 text-xs text-axion-text-tertiary">
            {showDeepLinks ? "Choose a wallet to open" : "Choose a wallet to connect"}
          </p>
          <div className="space-y-1.5">
            {walletOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => handleWalletClick(option)}
                disabled={isConnecting}
                className="group flex w-full items-center gap-3.5 rounded-xl border border-axion-border bg-axion-bg-tertiary p-3.5 text-left transition-all hover:border-brand/50 hover:bg-axion-bg-secondary disabled:opacity-50"
              >
                {/* Official Logo */}
                <img
                  src={option.logo}
                  alt={option.name}
                  className="h-10 w-10 shrink-0 rounded-full object-cover"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-white">
                      {option.name}
                    </p>
                    {option.popular && (
                      <span className="rounded-full bg-brand/15 px-1.5 py-0.5 text-[10px] font-semibold text-brand">
                        Popular
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-axion-text-tertiary truncate">
                    {option.description}
                  </p>
                </div>

                {/* Deep link indicator for mobile */}
                {showDeepLinks && option.deepLink && option.id !== "walletconnect" && (
                  <span className="shrink-0 rounded-md bg-brand/10 px-2 py-1 text-[10px] font-medium text-brand">
                    Open
                  </span>
                )}
                {!showDeepLinks && option.id === "walletconnect" && (
                  <QrCode className="h-4 w-4 shrink-0 text-axion-text-muted" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-axion-border px-5 py-3">
          <p className="text-center text-xs text-axion-text-muted">
            New to wallets?{" "}
            <a
              href="https://ethereum.org/en/wallets/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand hover:text-brand-light"
            >
              Learn more
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
