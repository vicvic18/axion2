import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from "react";
import { ACTIVE_NETWORK } from "../contracts/contract";

interface WalletState {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  chainId: number | null;
  walletName: string | null;
}

interface WalletContextType extends WalletState {
  connect: (walletId: string) => Promise<void>;
  disconnect: () => void;
  /** Switch to the configured BSC network */
  switchNetwork: () => Promise<void>;
  /** True if wallet is on the wrong network */
  isWrongNetwork: boolean;
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
  });

  const wcProviderRef = useRef<any>(null);

  const isWrongNetwork = state.chainId !== null && state.chainId !== BSC_CHAIN_ID;

  // Check existing connection
  useEffect(() => {
    const check = async () => {
      if (typeof window === "undefined") return;
      const eth = (window as any).ethereum;
      if (!eth) return;
      try {
        const accounts = await eth.request({ method: "eth_accounts" });
        if (accounts?.length > 0) {
          const chainId = await eth.request({ method: "eth_chainId" });
          setState({
            address: accounts[0],
            isConnected: true,
            isConnecting: false,
            error: null,
            chainId: parseInt(chainId, 16),
            walletName: "MetaMask",
          });
        }
      } catch { /* ignore */ }
    };
    check();
  }, []);

  // Listen for wallet changes
  useEffect(() => {
    if (typeof window === "undefined") return;
    const eth = (window as any).ethereum;
    if (!eth) return;
    const onAccounts = (accounts: string[]) => {
      if (accounts.length === 0) {
        setState(prev => ({ ...prev, address: null, isConnected: false, walletName: null }));
      } else {
        setState(prev => ({ ...prev, address: accounts[0], isConnected: true }));
      }
    };
    const onChain = (chainId: string) => {
      setState(prev => ({ ...prev, chainId: parseInt(chainId, 16) }));
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
      // Chain not added yet, try adding it
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
    const chainId = await eth.request({ method: "eth_chainId" });
    setState(prev => ({
      ...prev,
      address: accounts[0],
      isConnected: true,
      isConnecting: false,
      chainId: parseInt(chainId, 16),
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
      methods: ["eth_sendTransaction", "eth_sign", "personal_sign", "eth_accounts", "eth_chainId"],
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
    const chainId = provider.chainId;
    wcProviderRef.current = provider;

    setState(prev => ({
      ...prev,
      address: accounts[0],
      isConnected: true,
      isConnecting: false,
      chainId,
      walletName: "WalletConnect",
    }));

    provider.on("accountsChanged", (newAccounts: string[]) => {
      if (newAccounts.length === 0) {
        setState({ address: null, isConnected: false, isConnecting: false, error: null, chainId: null, walletName: null });
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
        await connectInjected("Binance Web3 Wallet");
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
    setState({ address: null, isConnected: false, isConnecting: false, error: null, chainId: null, walletName: null });
  }, []);

  return (
    <WalletContext.Provider value={{ ...state, connect, disconnect, switchNetwork, isWrongNetwork }}>
      {children}
    </WalletContext.Provider>
  );
}
