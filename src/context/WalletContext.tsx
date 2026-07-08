import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from "react";
import { ACTIVE_NETWORK } from "../contracts/contract";

interface WalletState {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  chainId: number | null;
  walletName: string | null;
  balance: string; // BNB balance in ether
}

interface WalletContextType extends WalletState {
  connect: (walletId: string) => Promise<void>;
  disconnect: () => void;
  /** Switch to the configured BSC network */
  switchNetwork: () => Promise<void>;
  /** True if wallet is on the wrong network */
  isWrongNetwork: boolean;
  refreshBalance: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | null>(null);

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used within WalletProvider");
  return ctx;
}

const BSC_CHAIN_ID = ACTIVE_NETWORK.chainId;
const BSC_RPC = ACTIVE_NETWORK.rpc;
const PROJECT_ID = "2f0e5d4b54e1e6f15571cc0607f94b8b";

export function WalletProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<WalletState>({
    address: null,
    isConnected: false,
    isConnecting: false,
    error: null,
    chainId: null,
    walletName: null,
    balance: "0",
  });

  const wcProviderRef = useRef<any>(null);

  const isWrongNetwork = state.chainId !== null && state.chainId !== BSC_CHAIN_ID;

  // Fetch balance
  const refreshBalance = useCallback(async () => {
    if (!state.address || typeof window === "undefined") return;
    try {
      const { BrowserProvider } = await import("ethers");
      const provider = new BrowserProvider((window as any).ethereum);
      const bal = await provider.getBalance(state.address);
      setState(prev => ({ ...prev, balance: (Number(bal) / 1e18).toFixed(6) }));
    } catch {
      // ignore
    }
  }, [state.address]);

  // Check existing connection
  useEffect(() => {
    const check = async () => {
      if (typeof window === "undefined") return;
      const eth = (window as any).ethereum;
      if (!eth) return;
      try {
        const accounts = await eth.request({ method: "eth_accounts" });
        if (accounts?.length > 0) {
          const chainIdHex = await eth.request({ method: "eth_chainId" });
          const chainIdNum = typeof chainIdHex === "string" && chainIdHex.startsWith("0x")
            ? parseInt(chainIdHex, 16)
            : parseInt(String(chainIdHex));
          setState(prev => ({
            ...prev,
            address: accounts[0],
            isConnected: true,
            isConnecting: false,
            error: null,
            chainId: isNaN(chainIdNum) ? null : chainIdNum,
            walletName: "MetaMask",
          }));
        }
      } catch { /* ignore */ }
    };
    check();
  }, []);

  // Auto-refresh balance every 10s when connected
  useEffect(() => {
    if (!state.isConnected) return;
    refreshBalance();
    const interval = setInterval(refreshBalance, 10000);
    return () => clearInterval(interval);
  }, [state.isConnected, state.address, refreshBalance]);

  // Listen for wallet changes
  useEffect(() => {
    if (typeof window === "undefined") return;
    const eth = (window as any).ethereum;
    if (!eth) return;
    const onAccounts = (accounts: string[]) => {
      if (accounts.length === 0) {
        setState(prev => ({ ...prev, address: null, isConnected: false, walletName: null, balance: "0" }));
      } else {
        setState(prev => ({ ...prev, address: accounts[0], isConnected: true }));
      }
    };
    const onChain = (chainId: string) => {
      const chainIdNum = typeof chainId === "string" && chainId.startsWith("0x")
        ? parseInt(chainId, 16)
        : parseInt(String(chainId));
      setState(prev => ({ ...prev, chainId: isNaN(chainIdNum) ? null : chainIdNum }));
    };
    eth.on("accountsChanged", onAccounts);
    eth.on("chainChanged", onChain);
    return () => {
      eth.removeListener("accountsChanged", onAccounts);
      eth.removeListener("chainChanged", onChain);
    };
  }, []);

  // ── Switch network ──
  const switchNetwork = useCallback(async () => {
    if (typeof window === "undefined") return;
    const eth = (window as any).ethereum;
    if (!eth) return;

    const chainIdHex = "0x" + BSC_CHAIN_ID.toString(16);
    try {
      await eth.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: chainIdHex }],
      });
    } catch (switchErr: any) {
      if (switchErr?.code === 4902) {
        await eth.request({
          method: "wallet_addEthereumChain",
          params: [{
            chainId: chainIdHex,
            chainName: ACTIVE_NETWORK.name,
            nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
            rpcUrls: [BSC_RPC],
            blockExplorerUrls: [ACTIVE_NETWORK.explorer],
          }],
        });
      } else {
        throw switchErr;
      }
    }
  }, []);

  // ── Connect injected wallet ──
  const connectInjected = async (walletName: string) => {
    const eth = (window as any).ethereum;
    if (!eth) {
      if (walletName === "MetaMask") window.open("https://metamask.io/download/", "_blank");
      else if (walletName === "Trust Wallet") window.open("https://trustwallet.com/download", "_blank");
      else if (walletName === "Binance Web3 Wallet") window.open("https://www.binance.com/en/web3wallet", "_blank");
      throw new Error(`${walletName} not found`);
    }
    const accounts = await eth.request({ method: "eth_requestAccounts" });
    const chainIdHex = await eth.request({ method: "eth_chainId" });
    // Safe parse: handle both hex "0x61" and decimal "97" strings
    const chainIdNum = typeof chainIdHex === "string" && chainIdHex.startsWith("0x")
      ? parseInt(chainIdHex, 16)
      : parseInt(String(chainIdHex));
    setState(prev => ({
      ...prev,
      address: accounts[0],
      isConnected: true,
      isConnecting: false,
      chainId: isNaN(chainIdNum) ? null : chainIdNum,
      walletName,
    }));
  };

  // ── WalletConnect with manual QR modal ──
  const connectWalletConnect = async () => {
    const { EthereumProvider } = await import("@walletconnect/ethereum-provider");
    const { WalletConnectModal } = await import("@walletconnect/modal");

    const provider = await EthereumProvider.init({
      projectId: PROJECT_ID,
      chains: [BSC_CHAIN_ID],
      showQrModal: false,
      methods: ["eth_sendTransaction", "personal_sign", "eth_accounts", "eth_chainId"],
      events: ["chainChanged", "accountsChanged"],
      rpcMap: { [BSC_CHAIN_ID]: BSC_RPC },
      metadata: {
        name: "Axion Stake",
        description: "Stake BNB with Axion validator",
        url: typeof window !== "undefined" ? window.location.origin : "",
        icons: [typeof window !== "undefined" ? `${window.location.origin}/logo.png` : ""],
      },
    });

    const modal = new WalletConnectModal({
      projectId: PROJECT_ID,
      themeMode: "dark",
    } as any);

    provider.on("display_uri", (displayUri: string) => {
      modal.openModal({ uri: displayUri });
    });

    try {
      await provider.enable();
    } catch (err: any) {
      modal.closeModal();
      if (err?.message?.includes("rejected") || err?.code === 5000) {
        throw new Error("Connection rejected");
      }
      throw err;
    } finally {
      setTimeout(() => {
        try { modal.closeModal(); } catch { /* ok */ }
      }, 3000);
    }

    const accounts = provider.accounts;
    const wcChainId = provider.chainId;
    wcProviderRef.current = provider;

    setState(prev => ({
      ...prev,
      address: accounts[0],
      isConnected: true,
      isConnecting: false,
      chainId: typeof wcChainId === "number" ? wcChainId : parseInt(String(wcChainId)) || null,
      walletName: "WalletConnect",
    }));

    provider.on("accountsChanged", (newAccounts: string[]) => {
      if (newAccounts.length === 0) {
        setState({ address: null, isConnected: false, isConnecting: false, error: null, chainId: null, walletName: null, balance: "0" });
      } else {
        setState(prev => ({ ...prev, address: newAccounts[0] }));
      }
    });
    provider.on("chainChanged", (newChainId: string) => {
      setState(prev => ({ ...prev, chainId: parseInt(newChainId) }));
    });
  };

  // ── Public connect ──
  const connect = useCallback(async (walletId: string) => {
    if (typeof window === "undefined") return;
    setState(prev => ({ ...prev, isConnecting: true, error: null }));

    try {
      if (walletId === "walletconnect") {
        await connectWalletConnect();
      } else if (walletId === "metamask") {
        await connectInjected("MetaMask");
      } else if (walletId === "trust") {
        await connectInjected("Trust Wallet");
      } else if (walletId === "binance") {
        await connectInjected("Binance Web3 Web3 Wallet");
      }
    } catch (err: any) {
      if (err?.code === 4001 || err?.message?.toLowerCase().includes("rejected")) {
        setState(prev => ({ ...prev, isConnecting: false, error: null }));
        return;
      }
      console.error("Wallet connect error:", err);
      setState(prev => ({ ...prev, isConnecting: false, error: err.message }));
    }
  }, []);

  const disconnect = useCallback(() => {
    if (wcProviderRef.current) {
      try { wcProviderRef.current.disconnect(); } catch { /* ok */ }
      wcProviderRef.current = null;
    }
    setState({ address: null, isConnected: false, isConnecting: false, error: null, chainId: null, walletName: null, balance: "0" });
  }, []);

  return (
    <WalletContext.Provider value={{ ...state, connect, disconnect, switchNetwork, isWrongNetwork, refreshBalance }}>
      {children}
    </WalletContext.Provider>
  );
}
