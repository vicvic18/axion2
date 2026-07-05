// EIP-6963 Types
export interface EIP6963ProviderInfo {
  uuid: string;
  name: string;
  icon: string;
  rdns?: string;
}

export interface EIP6963Provider {
  info: EIP6963ProviderInfo;
  provider: any;
}

export interface EIP6963AnnounceProviderEvent extends Event {
  detail: {
    info: EIP6963ProviderInfo;
    provider: any;
  };
}

declare global {
  interface Window {
    ethereum?: any;
  }
}
