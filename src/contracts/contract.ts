// AxionStaking Contract Configuration
// ====================================
// Replace CONTRACT_ADDRESS with your deployed contract address

export const CONTRACT_ADDRESS =
  (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_CONTRACT_ADDRESS) ||
  "0xB52D5055dcc5daEfcC844BBEB5d44D02248E1Bf6"; // <-- 把你的合约地址填在这里

// BSC Network Config
export const BSC_MAINNET = {
  chainId: 56,
  name: "BSC Mainnet",
  rpc: "https://bsc-dataseed.binance.org/",
  explorer: "https://bscscan.com",
};

export const BSC_TESTNET = {
  chainId: 97,
  name: "BSC Testnet",
  rpc: "https://data-seed-prebsc-1-s1.binance.org:8545/",
  explorer: "https://testnet.bscscan.com",
};

// Active network: MAINNET for production
export const ACTIVE_NETWORK = BSC_MAINNET;

// ABI (Application Binary Interface) - auto-generated from Solidity source
export const ABI = [
  // ---- Custom Errors ----
  "error ZeroAmount()",
  "error InvalidPeriod()",
  "error StakeNotFound()",
  "error StakeAlreadyClaimed()",
  "error StakeAlreadyUnstaked()",
  "error StakeStillLocked(uint256 remainingSeconds)",
  "error NothingToClaim()",
  "error TransferFailed()",
  "error NotOwner()",
  "error NoContractBalance()",
  "error AmountExceedsBalance()",
  "error SelfReferral()",
  "error AlreadyHasReferrer()",
  "error NoCommissionToClaim()",

  // ---- Events ----
  "event Staked(address indexed user, uint256 indexed stakeId, uint256 amount, uint256 periodSeconds, uint256 dailyRate, uint256 reward, uint256 unlockTime, address indexed referrer)",
  "event Unstaked(address indexed user, uint256 indexed stakeId, uint256 principal, uint256 reward)",
  "event Claimed(address indexed user, uint256 indexed stakeId, uint256 principal, uint256 reward, uint256 sentAmount, bool principalReleased)",
  "event ClaimedAll(address indexed user, uint256 totalPrincipal, uint256 totalReward, uint256 totalSent, uint256 principalKept)",
  "event OwnerWithdrawal(address indexed owner, uint256 amount, uint256 contractBalanceAfter)",
  "event ReferrerBound(address indexed user, address indexed referrer, address indexed l2Referrer)",
  "event CommissionPaid(address indexed recipient, address indexed fromUser, uint256 amount, uint8 level)",
  "event CommissionClaimed(address indexed user, uint256 amount)",

  // ---- Constants ----
  "function DAILY_RATE_SHORT() view returns (uint256)",
  "function DAILY_RATE_LONG() view returns (uint256)",
  "function BASIS_POINTS() view returns (uint256)",
  "function CLAIM_TIER_SMALL_MAX() view returns (uint256)",
  "function ONE_DAY_SECONDS() view returns (uint256)",
  "function L1_RATE() view returns (uint256)",
  "function L2_RATE() view returns (uint256)",
  "function MIN_REFERRAL_STAKE() view returns (uint256)",
  "function owner() view returns (address)",

  // ---- View / Pure Functions ----
  "function calculateReward(uint256 principal, uint256 dailyRate, uint256 periodSeconds) pure returns (uint256)",
  "function calculateTotalReturn(uint256 principal, uint256 dailyRate, uint256 periodSeconds) pure returns (uint256)",
  "function getUserStakeIds(address user) view returns (uint256[])",
  "function getStake(address user, uint256 stakeId) view returns (tuple(uint256 id, uint256 principal, uint256 periodSeconds, uint256 dailyRate, uint256 startTime, uint256 endTime, uint256 reward, bool claimed, bool unstaked))",
  "function getDashboard(address user) view returns (tuple(uint256 walletBalance, uint256 totalDelegated, uint256 totalUndelegating, uint256 totalReadyToClaim, uint256 totalRewardReady, uint256 totalClaimed))",
  "function getClaimableStakeIds(address user) view returns (uint256[])",
  "function getReferralInfo(address user) view returns (tuple(address referrer, address l1Referrer, address l2Referrer, uint256 l1Count, uint256 l2Count, uint256 commissionBalance, uint256 totalCommissionEarned))",
  "function getCommissionHistory(address user) view returns (tuple(address from, uint256 amount, uint8 level, uint256 timestamp, uint256 stakeAmount)[])",
  "function getMyReferralCode(address user) pure returns (string)",
  "function stakes(address, uint256) view returns (uint256 id, uint256 principal, uint256 periodSeconds, uint256 dailyRate, uint256 startTime, uint256 endTime, uint256 reward, bool claimed, bool unstaked)",
  "function userTotalClaimed(address) view returns (uint256)",
  "function userTotalStakedAmount(address) view returns (uint256)",
  "function referrerOf(address) view returns (address)",
  "function commissionBalance(address) view returns (uint256)",
  "function totalCommissionEarned(address) view returns (uint256)",
  "function l1Referrals(address, uint256) view returns (address)",
  "function commissionHistory(address, uint256) view returns (address from, uint256 amount, uint8 level, uint256 timestamp, uint256 stakeAmount)",

  // ---- Write Functions ----
  "function stake(uint256 periodSeconds) payable returns (uint256 stakeId)",
  "function stake(uint256 periodSeconds, address referrer) payable returns (uint256 stakeId)",
  "function unstake(uint256 stakeId)",
  "function claim(uint256 stakeId)",
  "function claimAll()",
  "function claimCommission()",
  "function withdrawAll()",
  "function withdraw(uint256 amount)",

  // ---- Fallback ----
  "receive() external payable",
];

// Helper: format wei to BNB (18 decimals)
export function formatBNB(wei: bigint | string | number): string {
  const val = typeof wei === "bigint" ? wei : BigInt(wei);
  return (Number(val) / 1e18).toFixed(4);
}

// Helper: parse BNB to wei
export function parseBNB(amount: string): bigint {
  return BigInt(Math.floor(parseFloat(amount) * 1e18));
}

// Helper: get referral link for current user
export function getReferralLink(address: string): string {
  return `${typeof window !== "undefined" ? window.location.origin : ""}?ref=${address}`;
}
