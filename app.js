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

const staticCities = [
    { name: "Kyiv", lat: 50.4501, lon: 30.5234 },
    { name: "Lviv", lat: 49.8397, lon: 24.0297 },
    { name: "Odessa", lat: 46.4825, lon: 30.7233 },
    { name: "Kharkiv", lat: 49.9935, lon: 36.2304 },
    { name: "Dnipro", lat: 48.4647, lon: 35.0462 },
];

document.getElementById("connect-wallet").addEventListener("click", async () => {
    console.log("Connect Wallet button clicked");
    const statusElement = document.getElementById("status");
    const addressElement = document.getElementById("address");

    if (typeof window.ethereum === "undefined") {
        console.error("MetaMask is not detected.");
        alert("MetaMask is not detected. Please install MetaMask to continue.");
        statusElement.textContent = "Status: MetaMask not detected";
        return;
    }

    try {
        console.log("Requesting wallet connection...");
        await window.ethereum.request({ method: "eth_requestAccounts" });
        console.log("Wallet connected!");

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        console.log("Provider initialized:", provider);

        const signer = provider.getSigner();
        const address = await signer.getAddress();
        console.log("Wallet address:", address);

        userWalletConnected = true;
        statusElement.textContent = "Status: Wallet connected";
        addressElement.textContent = `Connected wallet address: ${address}`;

        // Показати карту після підключення
        document.getElementById("connect-container").style.display = "none";
        document.getElementById("map").style.display = "block";
        initializeMap();
    } catch (err) {
        console.error("Error connecting wallet:", err);
        alert("Failed to connect wallet. Check the console for details.");
        statusElement.textContent = "Status: Connection failed";
    }
});

function initializeMap() {
    console.log("Initializing map...");
    const map = L.map('map').setView([48.3794, 31.1656], 6); // Центр: Україна
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    loadStaticCities(map);
}

function loadStaticCities(map) {
    console.log("Loading static cities...");
    staticCities.forEach(city => {
        const marker = L.marker([city.lat, city.lon]).addTo(map);
        marker.bindPopup(`
            <strong>${city.name}</strong><br>
            <button class="check-in-btn" data-lat="${city.lat}" data-lon="${city.lon}">Check-In</button>
        `);

        map.on('popupopen', function (e) {
            const button = e.popup._contentNode.querySelector('.check-in-btn');
            if (button) {
                button.addEventListener('click', () => handleCheckIn(city.lat, city.lon));
            }
        });
    });
}

async function handleCheckIn(lat, lon) {
    if (!userWalletConnected) {
        alert("Please connect your wallet first.");
        return;
    }

    try {
        console.log("Handling check-in...");
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);

        const location = `${lat.toFixed(5)},${lon.toFixed(5)}`;
        console.log("Check-in location:", location);

        // Додано логування перед викликом контракту
        console.log("Calling getCheckIn...");
        const checkInData = await contract.getCheckIn(location);
        console.log("Check-in data:", checkInData);

        const now = Math.floor(Date.now() / 1000);
        const isExpired = checkInData.expiry < now;
        const fee = isExpired ? ethers.utils.parseUnits("0.00001991", "ether") : checkInData.amount.mul(2);

        console.log("Fee calculated:", ethers.utils.formatEther(fee));

        const tx = await contract.checkIn(location, { value: fee });
        await tx.wait();

        alert("Check-in successful!");
    } catch (err) {
        console.error("Error during check-in:", err);
        alert("Error during check-in. Check the console for details.");
    }
}
