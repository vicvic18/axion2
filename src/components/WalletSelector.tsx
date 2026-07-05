import { X, AlertCircle } from "lucide-react";

interface WalletSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (walletId: string) => void;
  isConnecting: boolean;
  error: string | null;
}

const walletOptions = [
  {
    id: "metamask",
    name: "MetaMask",
    description: "Connect to your MetaMask wallet",
    logo: "/wallets/metamask.png",
    popular: true,
  },
  {
    id: "trust",
    name: "Trust Wallet",
    description: "Connect to your Trust Wallet",
    logo: "/wallets/trust.png",
  },
  {
    id: "binance",
    name: "Binance Web3 Wallet",
    description: "Connect to Binance Wallet",
    logo: "/wallets/binance.png",
  },
  {
    id: "walletconnect",
    name: "WalletConnect",
    description: "Scan QR code with any wallet",
    logo: "/wallets/walletconnect.png",
  },
];

export default function WalletSelector({
  isOpen,
  onClose,
  onSelect,
  isConnecting,
  error,
}: WalletSelectorProps) {
  if (!isOpen) return null;

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

        {/* Wallet Options */}
        <div className="px-3 pb-4">
          <p className="mb-3 px-2 text-xs text-axion-text-tertiary">
            Choose a wallet to connect
          </p>
          <div className="space-y-1.5">
            {walletOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => onSelect(option.id)}
                disabled={isConnecting}
                className="group flex w-full items-center gap-3.5 rounded-xl border border-axion-border bg-axion-bg-tertiary p-3.5 text-left transition-all hover:border-brand/50 hover:bg-axion-bg-secondary disabled:opacity-50"
              >
                {/* Official Logo */}
                <img
                  src={option.logo}
                  alt={option.name}
                  className="h-10 w-10 shrink-0 rounded-full object-cover"
                />

                <div className="flex-1">
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
                  <p className="text-xs text-axion-text-tertiary">
                    {option.description}
                  </p>
                </div>
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
