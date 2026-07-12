// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title AxionStaking
 * @dev BNB Chain staking contract - Axion validator trial staking
 *
 * REWARD MODEL (Daily Rate, NOT APY):
 *   - Short lockup (<= 1 day): 1.3% daily reward
 *   - Long lockup  (> 1 day):  1.52% daily reward
 *   Lock-up time is expressed in SECONDS (e.g. 86400 = 1 day, 604800 = 7 days)
 *
 * CLAIM TIERS:
 *   - Small (principal <= 0.29 BNB): claim releases principal + reward
 *   - Large (principal > 0.29 BNB):  claim releases reward only (principal stays)
 *
 * REFERRAL SYSTEM (Two-level):
 *   - L1 (direct):  1% commission on each stake
 *   - L2 (indirect): 0.25% commission on each stake
 *   - Commission source: deducted from stake amount
 *   - Eligibility: must have staked >= 0.01 BNB to get referral link
 *
 * OWNER: deployer wallet can withdraw all BNB from contract.
 */
abstract contract ReentrancyGuard {
    uint256 private constant _NOT_ENTERED = 1;
    uint256 private constant _ENTERED = 2;
    uint256 private _status;

    constructor() {
        _status = _NOT_ENTERED;
    }

    modifier nonReentrant() {
        require(_status != _ENTERED, "Reentrant call");
        _status = _ENTERED;
        _;
        _status = _NOT_ENTERED;
    }
}

contract AxionStaking is ReentrancyGuard {

    // ============ Custom Errors ============
    error ZeroAmount();
    error InvalidPeriod();
    error StakeNotFound();
    error StakeAlreadyClaimed();
    error StakeAlreadyUnstaked();
    error StakeStillLocked(uint256 remainingSeconds);
    error NothingToClaim();
    error TransferFailed();
    error NotOwner();
    error NoContractBalance();
    error AmountExceedsBalance();
    error SelfReferral();
    error AlreadyHasReferrer();
    error NoCommissionToClaim();

    // ============ Events ============
    event Staked(
        address indexed user,
        uint256 indexed stakeId,
        uint256 amount,
        uint256 periodSeconds,
        uint256 dailyRate,
        uint256 reward,
        uint256 unlockTime,
        address indexed referrer
    );
    event Unstaked(
        address indexed user,
        uint256 indexed stakeId,
        uint256 principal,
        uint256 reward
    );
    event Claimed(
        address indexed user,
        uint256 indexed stakeId,
        uint256 principal,
        uint256 reward,
        uint256 sentAmount,
        bool    principalReleased
    );
    event ClaimedAll(
        address indexed user,
        uint256 totalPrincipal,
        uint256 totalReward,
        uint256 totalSent,
        uint256 principalKept
    );
    event OwnerWithdrawal(
        address indexed owner,
        uint256 amount,
        uint256 contractBalanceAfter
    );
    event ReferrerBound(
        address indexed user,
        address indexed referrer,
        address indexed l2Referrer
    );
    event CommissionPaid(
        address indexed recipient,
        address indexed fromUser,
        uint256 amount,
        uint8   level        // 1 = L1, 2 = L2
    );
    event CommissionClaimed(
        address indexed user,
        uint256 amount
    );

    // ============ Structs ============
    struct Stake {
        uint256 id;
        uint256 principal;
        uint256 periodSeconds;  // lockup duration in seconds (was: plan)
        uint256 dailyRate;
        uint256 startTime;
        uint256 endTime;
        uint256 reward;
        bool    claimed;
        bool    unstaked;
    }

    struct Dashboard {
        uint256 walletBalance;
        uint256 totalDelegated;
        uint256 totalUndelegating;
        uint256 totalReadyToClaim;
        uint256 totalRewardReady;
        uint256 totalClaimed;
    }

    struct ReferralInfo {
        address referrer;           // who referred me
        address l1Referrer;         // my direct referrer
        address l2Referrer;         // my indirect referrer
        uint256 l1Count;            // how many L1 referrals I have
        uint256 l2Count;            // how many L2 referrals I have
        uint256 commissionBalance;  // claimable commission
        uint256 totalCommissionEarned; // total earned (claimable + claimed)
    }

    // ============ Constants ============
    uint256 public constant DAILY_RATE_SHORT = 130;  // 1.30%  (for period <= 1 day)
    uint256 public constant DAILY_RATE_LONG  = 152;  // 1.52%  (for period > 1 day)
    uint256 public constant BASIS_POINTS     = 10000;
    uint256 public constant CLAIM_TIER_SMALL_MAX = 0.29 ether;
    uint256 public constant ONE_DAY_SECONDS  = 86400; // 1 day in seconds

    // Referral commission rates (in basis points)
    uint256 public constant L1_RATE = 100;    // 1%
    uint256 public constant L2_RATE = 25;     // 0.25%
    uint256 public constant MIN_REFERRAL_STAKE = 0.01 ether; // min stake to be eligible as referrer

    // ============ State ============
    address public immutable owner;
    uint256 private nextStakeId;

    // Staking
    mapping(address => mapping(uint256 => Stake)) public stakes;
    mapping(address => uint256[]) private _userStakeIds;
    mapping(address => uint256) public userTotalClaimed;

    // user => total staked amount (lifetime, for referral eligibility)
    mapping(address => uint256) public userTotalStakedAmount;

    // Referral: user => who referred them
    mapping(address => address) public referrerOf;
    // Referral: user => commission balance (claimable)
    mapping(address => uint256) public commissionBalance;
    // Referral: user => total earned
    mapping(address => uint256) public totalCommissionEarned;
    // Referral: user => L1 referral addresses
    mapping(address => address[]) public l1Referrals;
    // Referral: commission history count
    mapping(address => CommissionRecord[]) public commissionHistory;

    struct CommissionRecord {
        address from;       // who generated this commission
        uint256 amount;     // commission amount
        uint8   level;      // 1 or 2
        uint256 timestamp;
        uint256 stakeAmount;
    }

    // ============ Constructor ============
    constructor() {
        owner = msg.sender;
        nextStakeId = 1;
    }

    // ============ Modifiers ============
    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner();
        _;
    }

    // ============ Pure / View ============

    /// @dev period in seconds; dailyRate in basis points
    /// Rewards calculated by DAYS (min 1 day), uses ONE_DAY_SECONDS for correct test/prod scaling
    function calculateReward(uint256 principal, uint256 dailyRate, uint256 periodSeconds)
        public pure returns (uint256)
    {
        uint256 dayLen = ONE_DAY_SECONDS; // constant, compiled inline
        uint256 daysNum = periodSeconds / dayLen;
        if (daysNum == 0) daysNum = 1; // minimum 1 day reward
        return (principal * dailyRate * daysNum) / BASIS_POINTS;
    }

    function calculateTotalReturn(uint256 principal, uint256 dailyRate, uint256 periodSeconds)
        public pure returns (uint256)
    {
        return principal + calculateReward(principal, dailyRate, periodSeconds);
    }

    function getUserStakeIds(address user) external view returns (uint256[] memory) {
        return _userStakeIds[user];
    }

    function getStake(address user, uint256 stakeId) external view returns (Stake memory) {
        return stakes[user][stakeId];
    }

    /**
     * @notice Get user's staking dashboard.
     */
    function getDashboard(address user) external view returns (Dashboard memory d) {
        d.walletBalance = user.balance;
        uint256[] memory ids = _userStakeIds[user];
        for (uint i = 0; i < ids.length; ++i) {
            Stake storage s = stakes[user][ids[i]];
            if (s.claimed) {
                // Count full principal + reward for claimed stakes
                d.totalClaimed += (s.principal + s.reward);
                continue;
            }
            if (block.timestamp < s.endTime) {
                d.totalDelegated += s.principal;
            } else {
                d.totalUndelegating += s.principal;
                d.totalReadyToClaim += (s.principal + s.reward);
                d.totalRewardReady  += s.reward;
            }
        }
    }

    function getClaimableStakeIds(address user) external view returns (uint256[] memory) {
        uint256[] memory ids = _userStakeIds[user];
        uint256 count;
        for (uint i = 0; i < ids.length; ++i) {
            Stake storage s = stakes[user][ids[i]];
            if (!s.claimed && block.timestamp >= s.endTime) ++count;
        }
        uint256[] memory result = new uint256[](count);
        uint256 j;
        for (uint i = 0; i < ids.length; ++i) {
            Stake storage s = stakes[user][ids[i]];
            if (!s.claimed && block.timestamp >= s.endTime) result[j++] = ids[i];
        }
        return result;
    }

    // ============ Referral View Functions ============

    /**
     * @notice Get complete referral info for a user.
     */
    function getReferralInfo(address user) external view returns (ReferralInfo memory info) {
        info.referrer = referrerOf[user];
        info.l1Referrer = referrerOf[user];
        info.l2Referrer = (referrerOf[user] != address(0)) ? referrerOf[referrerOf[user]] : address(0);
        info.l1Count = uint256(l1Referrals[user].length);
        // Count L2: all L1s of my L1s
        uint256 l2;
        for (uint i = 0; i < l1Referrals[user].length; ++i) {
            l2 += l1Referrals[l1Referrals[user][i]].length;
        }
        info.l2Count = l2;
        info.commissionBalance = commissionBalance[user];
        info.totalCommissionEarned = totalCommissionEarned[user];
    }

    /**
     * @notice Get commission history for a user.
     */
    function getCommissionHistory(address user) external view returns (CommissionRecord[] memory) {
        return commissionHistory[user];
    }

    /**
     * @notice Generate referral link hint (for off-chain use).
     */
    function getMyReferralCode(address user) external pure returns (string memory) {
        // Returns the address as hex string for use in URLs
        return _toAsciiString(user);
    }

    function _toAsciiString(address x) private pure returns (string memory) {
        bytes memory s = new bytes(40);
        for (uint i = 0; i < 20; i++) {
            bytes1 b = bytes1(uint8(uint(uint160(x)) / (2**(8*(19-i)))));
            bytes1 hi = bytes1(uint8(b) / 16);
            bytes1 lo = bytes1(uint8(b) - 16 * uint8(hi));
            s[2*i] = _char(hi);
            s[2*i+1] = _char(lo);
        }
        return string(s);
    }

    function _char(bytes1 b) private pure returns (bytes1 c) {
        if (uint8(b) < 10) return bytes1(uint8(b) + 0x30);
        else return bytes1(uint8(b) + 0x57);
    }

    // ============ Internal: Referral Logic ============

    /**
     * @dev Bind referrer for a user. Called during first stake.
     */
    function _bindReferrer(address user, address referrer) internal {
        if (referrer == address(0)) return;
        if (referrer == user) revert SelfReferral();
        if (referrerOf[user] != address(0)) return; // Already has referrer

        referrerOf[user] = referrer;
        l1Referrals[referrer].push(user);

        // L2: if referrer has their own referrer
        address l2 = referrerOf[referrer];

        emit ReferrerBound(user, referrer, l2);
    }

    /**
     * @dev Distribute commissions when a user stakes.
     * Eligibility: referrer must have staked >= 0.01 BNB lifetime.
     */
    function _distributeCommission(address staker, uint256 stakeAmount) internal {
        address l1 = referrerOf[staker];
        if (l1 == address(0)) return; // No referrer, skip

        // Check L1 eligibility: must have staked >= 0.01 BNB
        if (userTotalStakedAmount[l1] >= MIN_REFERRAL_STAKE) {
            // L1 commission: 1%
            uint256 l1Commission = (stakeAmount * L1_RATE) / BASIS_POINTS;
            commissionBalance[l1] += l1Commission;
            totalCommissionEarned[l1] += l1Commission;
            commissionHistory[l1].push(CommissionRecord({
                from: staker,
                amount: l1Commission,
                level: 1,
                timestamp: block.timestamp,
                stakeAmount: stakeAmount
            }));
            emit CommissionPaid(l1, staker, l1Commission, 1);
        }

        // L2 commission: 0.25%
        address l2 = referrerOf[l1];
        if (l2 != address(0) && userTotalStakedAmount[l2] >= MIN_REFERRAL_STAKE) {
            uint256 l2Commission = (stakeAmount * L2_RATE) / BASIS_POINTS;
            commissionBalance[l2] += l2Commission;
            totalCommissionEarned[l2] += l2Commission;
            commissionHistory[l2].push(CommissionRecord({
                from: staker,
                amount: l2Commission,
                level: 2,
                timestamp: block.timestamp,
                stakeAmount: stakeAmount
            }));
            emit CommissionPaid(l2, staker, l2Commission, 2);
        }
    }

    // ============ Stake ============

    /**
     * @notice Core stake implementation
     * @param periodSeconds Lock-up time in seconds (e.g. 60 for 1 minute, 86400 for 1 day)
     */
    function _stake(uint256 periodSeconds, address referrer) internal returns (uint256 stakeId) {
        if (msg.value == 0) revert ZeroAmount();
        if (periodSeconds == 0) revert InvalidPeriod();

        // Bind referrer on first stake
        if (referrer != address(0) && referrerOf[msg.sender] == address(0)) {
            _bindReferrer(msg.sender, referrer);
        }

        // Distribute referral commissions from stake amount
        _distributeCommission(msg.sender, msg.value);

        // Rate selection: short period (<=1 day) = 1.30%, long period (>1 day) = 1.52%
        uint256 dailyRate = (periodSeconds <= ONE_DAY_SECONDS) ? DAILY_RATE_SHORT : DAILY_RATE_LONG;
        stakeId = nextStakeId++;
        uint256 reward = calculateReward(msg.value, dailyRate, periodSeconds);

        stakes[msg.sender][stakeId] = Stake({
            id:            stakeId,
            principal:     msg.value,
            periodSeconds: periodSeconds,
            dailyRate:     dailyRate,
            startTime:     block.timestamp,
            endTime:       block.timestamp + periodSeconds,
            reward:        reward,
            claimed:       false,
            unstaked:      false
        });

        _userStakeIds[msg.sender].push(stakeId);
        userTotalStakedAmount[msg.sender] += msg.value; // Track lifetime stake for referral eligibility

        emit Staked(
            msg.sender,
            stakeId,
            msg.value,
            periodSeconds,
            dailyRate,
            reward,
            block.timestamp + periodSeconds,
            referrerOf[msg.sender]
        );
    }

    /**
     * @notice Stake BNB for a chosen lock-up period with optional referrer.
     * @param periodSeconds Lock-up time in seconds (e.g. 60 for test, 86400 for 1 day, 604800 for 7 days)
     * @param referrer Address of who referred you (0x0 if none)
     */
    function stake(uint256 periodSeconds, address referrer) external payable nonReentrant returns (uint256 stakeId) {
        return _stake(periodSeconds, referrer);
    }

    /// @notice Stake without referrer
    function stake(uint256 periodSeconds) external payable nonReentrant returns (uint256 stakeId) {
        return _stake(periodSeconds, address(0));
    }

    // ============ Unstake ============

    function unstake(uint256 stakeId) external nonReentrant {
        Stake storage s = stakes[msg.sender][stakeId];
        if (s.id == 0)           revert StakeNotFound();
        if (s.claimed)           revert StakeAlreadyClaimed();
        if (s.unstaked)          revert StakeAlreadyUnstaked();
        if (block.timestamp < s.endTime)
            revert StakeStillLocked(s.endTime - block.timestamp);

        s.unstaked = true;
        emit Unstaked(msg.sender, stakeId, s.principal, s.reward);
    }

    // ============ Claim (Tiered) ============

    function claim(uint256 stakeId) external nonReentrant {
        Stake storage s = stakes[msg.sender][stakeId];
        if (s.id == 0)           revert StakeNotFound();
        if (s.claimed)           revert StakeAlreadyClaimed();
        if (block.timestamp < s.endTime)
            revert StakeStillLocked(s.endTime - block.timestamp);

        s.claimed = true;
        bool isSmall = s.principal <= CLAIM_TIER_SMALL_MAX;
        uint256 sendAmount = isSmall ? (s.principal + s.reward) : s.reward;

        userTotalClaimed[msg.sender] += sendAmount;

        (bool ok, ) = payable(msg.sender).call{value: sendAmount}("");
        if (!ok) revert TransferFailed();

        emit Claimed(msg.sender, stakeId, s.principal, s.reward, sendAmount, isSmall);
    }

    function claimAll() external nonReentrant {
        uint256[] memory ids = _userStakeIds[msg.sender];
        uint256 totalSend;
        uint256 totalPrincipal;
        uint256 totalReward;
        uint256 principalKept;
        bool hasAny;

        for (uint i = 0; i < ids.length; ++i) {
            Stake storage s = stakes[msg.sender][ids[i]];
            if (s.claimed || block.timestamp < s.endTime) continue;

            hasAny = true;
            s.claimed = true;
            totalPrincipal += s.principal;
            totalReward    += s.reward;

            if (s.principal <= CLAIM_TIER_SMALL_MAX) {
                totalSend += s.principal + s.reward;
            } else {
                totalSend += s.reward;
                principalKept += s.principal;
            }
        }

        if (!hasAny) revert NothingToClaim();
        userTotalClaimed[msg.sender] += totalSend;

        (bool ok, ) = payable(msg.sender).call{value: totalSend}("");
        if (!ok) revert TransferFailed();

        emit ClaimedAll(msg.sender, totalPrincipal, totalReward, totalSend, principalKept);
    }

    // ============ Commission Claim ============

    /**
     * @notice Claim all referral commissions.
     */
    function claimCommission() external nonReentrant {
        uint256 amount = commissionBalance[msg.sender];
        if (amount == 0) revert NoCommissionToClaim();

        commissionBalance[msg.sender] = 0;

        (bool ok, ) = payable(msg.sender).call{value: amount}("");
        if (!ok) revert TransferFailed();

        emit CommissionClaimed(msg.sender, amount);
    }

    // ============ Owner ============

    function withdrawAll() external onlyOwner nonReentrant {
        uint256 balance = address(this).balance;
        if (balance == 0) revert NoContractBalance();

        (bool ok, ) = payable(owner).call{value: balance}("");
        if (!ok) revert TransferFailed();

        emit OwnerWithdrawal(owner, balance, address(this).balance);
    }

    function withdraw(uint256 amount) external onlyOwner nonReentrant {
        if (amount == 0) revert ZeroAmount();
        if (amount > address(this).balance) revert AmountExceedsBalance();

        (bool ok, ) = payable(owner).call{value: amount}("");
        if (!ok) revert TransferFailed();

        emit OwnerWithdrawal(owner, amount, address(this).balance);
    }

    // ============ Fallback ============
    receive() external payable {}
    fallback() external payable {}
}