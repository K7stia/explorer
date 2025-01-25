// Solidity smart contract (CheckInMap.sol)
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract CheckInMap {
    struct CheckIn {
        address user;
        uint256 expiry;
        uint256 amount;
    }

    struct User {
        uint256 xp;
        string twitterHandle;
    }

    mapping(string => CheckIn) public checkIns; // Map location to CheckIn
    mapping(address => User) public users; // Map user address to User data
    address public owner;
    uint256 public baseFee = 19910 wei; // 0.00001991 ETH

    event CheckInEvent(string location, address indexed user, uint256 amount, uint256 expiry);
    event UserRegistered(address indexed user, string twitterHandle);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    function updateBaseFee(uint256 newFee) external onlyOwner {
        baseFee = newFee;
    }

    function registerUser(string calldata twitterHandle) external {
        require(bytes(twitterHandle).length > 0, "Invalid Twitter handle");
        users[msg.sender] = User({
            xp: 0,
            twitterHandle: twitterHandle
        });
        emit UserRegistered(msg.sender, twitterHandle);
    }

    function checkIn(string calldata location) external payable {
        require(bytes(users[msg.sender].twitterHandle).length > 0, "User not registered");

        CheckIn storage current = checkIns[location];
        uint256 requiredFee = current.expiry > block.timestamp ? current.amount * 2 : baseFee;
        require(msg.value >= requiredFee, "Insufficient fee");

        // Transfer previous fee to owner
        if (current.amount > 0) {
            payable(owner).transfer(current.amount);
        }

        // Update check-in data
        checkIns[location] = CheckIn({
            user: msg.sender,
            expiry: block.timestamp + 24 hours,
            amount: msg.value
        });

        // Update user XP
        users[msg.sender].xp += 1;

        emit CheckInEvent(location, msg.sender, msg.value, block.timestamp + 24 hours);
    }

    function getLeaderboard() external view returns (address[] memory, uint256[] memory) {
        address[] memory topAddresses = new address[](50);
        uint256[] memory topXP = new uint256[](50);

        uint256 count = 0;
        for (uint256 i = 0; i < 50 && count < 50; i++) {
            // Sort and add logic for top users
        }
        return (topAddresses, topXP);
    }

    function getCheckIn(string calldata location) external view returns (CheckIn memory) {
        return checkIns[location];
    }
}
