const contractAddress = "0xF103c4cDfc25b706845Fc90f7Ee3c937d080F7ea"; // Замініть на адресу вашого контракту
const contractABI = [
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "location",
				"type": "string"
			}
		],
		"name": "checkIn",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "string",
				"name": "location",
				"type": "string"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "expiry",
				"type": "uint256"
			}
		],
		"name": "CheckInEvent",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "twitterHandle",
				"type": "string"
			}
		],
		"name": "registerUser",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "newFee",
				"type": "uint256"
			}
		],
		"name": "updateBaseFee",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "twitterHandle",
				"type": "string"
			}
		],
		"name": "UserRegistered",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "baseFee",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"name": "checkIns",
		"outputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "expiry",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "location",
				"type": "string"
			}
		],
		"name": "getCheckIn",
		"outputs": [
			{
				"components": [
					{
						"internalType": "address",
						"name": "user",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "expiry",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "amount",
						"type": "uint256"
					}
				],
				"internalType": "struct CheckInMap.CheckIn",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getLeaderboard",
		"outputs": [
			{
				"internalType": "address[]",
				"name": "",
				"type": "address[]"
			},
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "userList",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "users",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "xp",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "twitterHandle",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

let map = L.map('map').setView([0, 0], 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Перевірка MetaMask
if (typeof window.ethereum === "undefined") {
    alert("MetaMask не встановлено. Будь ласка, встановіть MetaMask і перезавантажте сторінку.");
}

async function fetchLeaderboard() {
    try {
        if (typeof ethers === "undefined") {
            throw new Error("ethers.js не завантажено.");
        }
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(contractAddress, contractABI, provider);

        const [addresses, scores] = await contract.getLeaderboard();
        const leaderboardDiv = document.getElementById('leaderboard');
        leaderboardDiv.innerHTML = '<h4>Leaderboard</h4>';
        for (let i = 0; i < addresses.length; i++) {
            leaderboardDiv.innerHTML += `<p>${addresses[i]}: ${scores[i]} XP</p>`;
        }
    } catch (err) {
        console.error("Error fetching leaderboard:", err);
    }
}

fetchLeaderboard();

map.on('click', async function (e) {
    try {
        if (typeof ethers === "undefined") {
            throw new Error("ethers.js не завантажено.");
        }
        const location = `${e.latlng.lat},${e.latlng.lng}`;
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);

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
        console.error("Error during check-in:", err);
        alert("Error: " + err.message);
    }
});
