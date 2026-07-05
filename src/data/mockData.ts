// Validator data for the table
export interface Validator {
  id: number;
  name: string;
  tag: string;
  totalStaked: number;
  stakedPercent: string;
  commission: string;
  apy: string;
  status: "Active" | "Inactive";
  iconColor: string;
}

const iconColors = [
  "#1199FF", "#FF6B35", "#22C55E", "#F59E0B", "#8B5CF6",
  "#EC4899", "#14B8A6", "#F97316", "#6366F1", "#10B981",
  "#EF4444", "#3B82F6", "#A855F7", "#EAB308", "#06B6D4",
  "#84CC16", "#D946EF", "#F43F5E", "#0EA5E9", "#8B5CF6",
];

export const validators: Validator[] = [
  { id: 1, name: "TWStaking", tag: "Cabinet", totalStaked: 1444827.97, stakedPercent: "5.62%", commission: "10.00%", apy: "0.58%", status: "Active", iconColor: iconColors[0] },
  { id: 2, name: "Namelix", tag: "Cabinet", totalStaked: 1228423.13, stakedPercent: "4.78%", commission: "10.00%", apy: "0.65%", status: "Active", iconColor: iconColors[1] },
  { id: 3, name: "CertiK", tag: "Cabinet", totalStaked: 1222971.69, stakedPercent: "4.76%", commission: "10.00%", apy: "0.65%", status: "Active", iconColor: iconColors[2] },
  { id: 4, name: "Fuji", tag: "Cabinet", totalStaked: 1217748.65, stakedPercent: "4.73%", commission: "10.00%", apy: "0.70%", status: "Active", iconColor: iconColors[3] },
  { id: 5, name: "Defibit", tag: "Cabinet", totalStaked: 1185467.08, stakedPercent: "4.61%", commission: "10.00%", apy: "0.72%", status: "Active", iconColor: iconColors[4] },
  { id: 6, name: "NodeReal", tag: "Cabinet", totalStaked: 1113479.86, stakedPercent: "4.33%", commission: "10.00%", apy: "0.81%", status: "Active", iconColor: iconColors[5] },
  { id: 7, name: "BscScan", tag: "Cabinet", totalStaked: 1097848.80, stakedPercent: "4.27%", commission: "10.00%", apy: "0.84%", status: "Active", iconColor: iconColors[6] },
  { id: 8, name: "LegendIII", tag: "Cabinet", totalStaked: 1096098.52, stakedPercent: "4.26%", commission: "9.00%", apy: "0.75%", status: "Active", iconColor: iconColors[7] },
  { id: 9, name: "Figment", tag: "Cabinet", totalStaked: 1094232.37, stakedPercent: "4.25%", commission: "10.00%", apy: "1.09%", status: "Active", iconColor: iconColors[8] },
  { id: 10, name: "HashKey", tag: "Cabinet", totalStaked: 1080053.13, stakedPercent: "4.20%", commission: "10.00%", apy: "0.84%", status: "Active", iconColor: iconColors[9] },
  { id: 11, name: "BNBEve", tag: "Cabinet", totalStaked: 1066449.94, stakedPercent: "4.15%", commission: "10.00%", apy: "1.22%", status: "Active", iconColor: iconColors[10] },
  { id: 12, name: "Legend", tag: "Cabinet", totalStaked: 1057876.61, stakedPercent: "4.11%", commission: "9.00%", apy: "0.78%", status: "Active", iconColor: iconColors[11] },
  { id: 13, name: "MathW", tag: "Cabinet", totalStaked: 1045081.60, stakedPercent: "4.06%", commission: "10.00%", apy: "0.78%", status: "Active", iconColor: iconColors[12] },
  { id: 14, name: "LegendII", tag: "Cabinet", totalStaked: 1040645.05, stakedPercent: "4.05%", commission: "9.00%", apy: "0.73%", status: "Active", iconColor: iconColors[13] },
  { id: 15, name: "Tranchess", tag: "Cabinet", totalStaked: 914411.68, stakedPercent: "3.56%", commission: "10.00%", apy: "0.59%", status: "Active", iconColor: iconColors[14] },
  { id: 16, name: "Avengers", tag: "Cabinet", totalStaked: 903253.14, stakedPercent: "3.51%", commission: "10.00%", apy: "0.56%", status: "Active", iconColor: iconColors[15] },
  { id: 17, name: "InfStones", tag: "Cabinet", totalStaked: 871388.92, stakedPercent: "3.39%", commission: "9.90%", apy: "0.57%", status: "Active", iconColor: iconColors[16] },
  { id: 18, name: "The48Club", tag: "Cabinet", totalStaked: 817145.33, stakedPercent: "3.18%", commission: "4.80%", apy: "0.64%", status: "Active", iconColor: iconColors[17] },
  { id: 19, name: "Feynman", tag: "Cabinet", totalStaked: 741743.51, stakedPercent: "2.88%", commission: "10.00%", apy: "0.64%", status: "Active", iconColor: iconColors[18] },
  { id: 20, name: "Shannon", tag: "Cabinet", totalStaked: 596429.54, stakedPercent: "2.32%", commission: "10.00%", apy: "0.73%", status: "Active", iconColor: iconColors[19] },
];

export const totalValidators = 53;

// Validator detail data
export const validatorDetail = {
  name: "Axion",
  status: "Active" as const,
  totalStaked: "128,921.2924",
  totalStakedRaw: 128921.2924,
  stakedPercent: "0.50%",
  apy: "1.30%",
  commission: "10%",
  operateSince: "2024-04-18",
  type: "Candidate",
  website: "-",
  selfDelegation: "2,849.86",
  delegators: 290,
  operatorAddress: "0xC1DA8b99...57c8B86AaF",
  operatorAddressFull: "0xC1DA8b99674137CC4971bF974cdC5157c8B86AaF",
  consensusAddress: "0xC2d534F0...6c607932c8",
  consensusAddressFull: "0xC2d534F079444E6E7Ff9DabB3FD8a26c607932c8",
  voteAddress: "0x8633993f...c27e00565c",
  voteAddressFull: "0x8633993f000000000000000000000000c27e00565c",
};

// Chart data - Reward History
export const rewardHistoryData = [
  { date: "20 May", value: 1.2, fullDate: "2026-05-20" },
  { date: "23 May", value: 3.5, fullDate: "2026-05-23" },
  { date: "25 May", value: 2.8, fullDate: "2026-05-25" },
  { date: "27 May", value: 2.1, fullDate: "2026-05-27" },
  { date: "29 May", value: 3.8, fullDate: "2026-05-29" },
  { date: "31 May", value: 3.2, fullDate: "2026-05-31" },
  { date: "2 Jun", value: 1.5, fullDate: "2026-06-02" },
  { date: "4 Jun", value: 4.8, fullDate: "2026-06-04" },
  { date: "6 Jun", value: 3.9, fullDate: "2026-06-06" },
  { date: "8 Jun", value: 2.5, fullDate: "2026-06-08" },
  { date: "10 Jun", value: 3.3, fullDate: "2026-06-10" },
  { date: "12 Jun", value: 2.1, fullDate: "2026-06-12" },
  { date: "14 Jun", value: 2.8, fullDate: "2026-06-14" },
  { date: "16 Jun", value: 1.9, fullDate: "2026-06-16" },
  { date: "18 Jun", value: 4.55, fullDate: "2026-06-18" },
];

// Chart data - Staking History
export const stakingHistoryData = [
  { date: "20 May", value: 125000, fullDate: "2026-05-20" },
  { date: "23 May", value: 126200, fullDate: "2026-05-23" },
  { date: "25 May", value: 125800, fullDate: "2026-05-25" },
  { date: "27 May", value: 127100, fullDate: "2026-05-27" },
  { date: "29 May", value: 126500, fullDate: "2026-05-29" },
  { date: "31 May", value: 127800, fullDate: "2026-05-31" },
  { date: "2 Jun", value: 127200, fullDate: "2026-06-02" },
  { date: "4 Jun", value: 128100, fullDate: "2026-06-04" },
  { date: "6 Jun", value: 127600, fullDate: "2026-06-06" },
  { date: "8 Jun", value: 128300, fullDate: "2026-06-08" },
  { date: "10 Jun", value: 128000, fullDate: "2026-06-10" },
  { date: "12 Jun", value: 128500, fullDate: "2026-06-12" },
  { date: "14 Jun", value: 128200, fullDate: "2026-06-14" },
  { date: "16 Jun", value: 128800, fullDate: "2026-06-16" },
  { date: "18 Jun", value: 128921, fullDate: "2026-06-18" },
];
