// Solidity smart contract
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

/* Frontend JavaScript + Mobile Adaptation */

const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Check-In Map</title>
    <script src="https://cdn.jsdelivr.net/npm/ethers/dist/ethers.min.js"></script>
    <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
    <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
    <style>
        #map {
            height: 90vh;
            width: 100%;
        }
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
        }
        @media (max-width: 768px) {
            #map {
                height: 85vh;
            }
        }
        #leaderboard {
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            max-height: 15vh;
            overflow-y: auto;
            background: rgba(255, 255, 255, 0.9);
            border-top: 1px solid #ccc;
            padding: 10px;
            box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
        }
    </style>
</head>
<body>
    <div id="map"></div>
    <div id="leaderboard"></div>
    <script src="app.js"></script>
</body>
</html>
`;

const jsContent = `
const contractAddress = "YOUR_CONTRACT_ADDRESS";
const contractABI = [
    // Contract ABI...
];

let map = L.map('map').setView([0, 0], 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

async function fetchLeaderboard() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(contractAddress, contractABI, provider);

    try {
        const [addresses, scores] = await contract.getLeaderboard();
        const leaderboardDiv = document.getElementById('leaderboard');
        leaderboardDiv.innerHTML = '<h4>Leaderboard</h4>';
        for (let i = 0; i < addresses.length; i++) {
            leaderboardDiv.innerHTML += `<p>${addresses[i]}: ${scores[i]} XP</p>`;
        }
    } catch (err) {
        console.error("Error fetching leaderboard", err);
    }
}

fetchLeaderboard();

map.on('click', async function (e) {
    const location = `${e.latlng.lat},${e.latlng.lng}`;
    if (!window.ethereum) {
        alert("Install MetaMask to use this feature");
        return;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    try {
        const checkInData = await contract.getCheckIn(location);
        const now = Math.floor(Date.now() / 1000);
        const isExpired = checkInData.expiry < now;
        const fee = isExpired ? ethers.utils.parseUnits("0.00001991", "ether") : checkInData.amount.mul(2);

        if (confirm(`Check-in fee for this location is ${ethers.utils.formatEther(fee)} ETH. Proceed?`)) {
            const tx = await contract.checkIn(location, { value: fee });
            await tx.wait();
            alert("Check-in successful!");
            fetchLeaderboard();
        }
    } catch (err) {
        console.error(err);
        alert("Error: " + err.message);
    }
});
`;

module.exports = { htmlContent, jsContent };
