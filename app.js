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

let userWalletConnected = false;
let userTwitterConnected = false;

// Створення UI елементів
const body = document.body;
body.style.margin = "0";
body.style.padding = "0";
body.style.fontFamily = "Arial, sans-serif";
body.style.backgroundColor = "rgba(255, 255, 255, 0.8)";

// Фон для карти
const mapContainer = document.createElement("div");
mapContainer.id = "map";
mapContainer.style.position = "absolute";
mapContainer.style.top = "0";
mapContainer.style.left = "0";
mapContainer.style.width = "100%";
mapContainer.style.height = "100%";
mapContainer.style.zIndex = "-1";
document.body.appendChild(mapContainer);

// Основний контейнер для авторизації
const mainContainer = document.createElement("div");
mainContainer.style.position = "absolute";
mainContainer.style.top = "0";
mainContainer.style.left = "0";
mainContainer.style.width = "100%";
mainContainer.style.height = "100%";
mainContainer.style.display = "flex";
mainContainer.style.flexDirection = "column";
mainContainer.style.justifyContent = "center";
mainContainer.style.alignItems = "center";
mainContainer.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
document.body.appendChild(mainContainer);

const step1 = document.createElement("div");
step1.innerHTML = `<h2>Step 1: Connect your wallet</h2>`;
mainContainer.appendChild(step1);

const walletButton = document.createElement("button");
walletButton.innerText = "Connect Wallet";
walletButton.style.padding = "10px 20px";
walletButton.style.fontSize = "16px";
walletButton.style.cursor = "pointer";
mainContainer.appendChild(walletButton);

const step2 = document.createElement("div");
step2.innerHTML = `<h2>Step 2: Connect your Twitter (X) account</h2>`;
step2.style.display = "none";
mainContainer.appendChild(step2);

const twitterButton = document.createElement("button");
twitterButton.innerText = "Connect Twitter";
twitterButton.style.padding = "10px 20px";
twitterButton.style.fontSize = "16px";
twitterButton.style.cursor = "pointer";
step2.appendChild(twitterButton);

// Ініціалізація карти (буде відображена після авторизації)
let map;
function initializeMap() {
    map = L.map('map').setView([0, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
}

// Логіка підключення гаманця
walletButton.addEventListener("click", async () => {
    try {
        if (typeof window.ethereum !== "undefined") {
            await window.ethereum.request({ method: "eth_requestAccounts" });
            userWalletConnected = true;
            alert("Wallet connected successfully!");
            step1.style.display = "none";
            step2.style.display = "block";
        } else {
            alert("No wallet detected. Please install MetaMask or use WalletConnect.");
        }
    } catch (error) {
        console.error("Error connecting wallet:", error);
    }
});

// Логіка підключення Twitter
twitterButton.addEventListener("click", () => {
    userTwitterConnected = true; // Імітація підключення
    alert("Twitter connected successfully!");
    mainContainer.style.display = "none";
    initializeMap();
});
