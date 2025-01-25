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
const activeCheckIns = new Map(); // Для зберігання активних чекінів

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

// Ініціалізація карти
let map;
function initializeMap() {
    map = L.map('map').setView([20, 0], 2); // Центр карти: весь світ
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    loadCitiesFromGeoNames(); // Завантаження міст через GeoNames API
}

// Завантаження міст із GeoNames API
async function loadCitiesFromGeoNames() {
    const geoNamesUrl = "http://api.geonames.org/citiesJSON";
    const username = "k7stia"; // Замініть на ваш GeoNames username
    const north = 90, south = -90, east = 180, west = -180;

    try {
        const response = await fetch(
            `${geoNamesUrl}?north=${north}&south=${south}&east=${east}&west=${west}&username=${username}`
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (!data.geonames || data.geonames.length === 0) {
            throw new Error("No cities found. Check your API limits or query.");
        }

        data.geonames.forEach((city) => {
            const marker = L.marker([city.lat, city.lng]).addTo(map);
            marker.bindPopup(
                `<strong>${city.name}</strong><br>
                <button class="check-in-btn" data-lat="${city.lat}" data-lon="${city.lng}">Check-In</button>`
            );
        });

        addCheckInHandlers();
    } catch (error) {
        console.error("Error loading cities from GeoNames:", error);
        alert(`Error loading cities: ${error.message}`);
    }
}

// Додаємо обробник для кнопок Check-In
function addCheckInHandlers() {
    map.on('popupopen', function (e) {
        const checkInButton = e.popup._contentNode.querySelector('.check-in-btn');
        if (checkInButton) {
            checkInButton.addEventListener('click', async (event) => {
                const lat = event.target.dataset.lat;
                const lon = event.target.dataset.lon;
                const location = `${parseFloat(lat).toFixed(5)},${parseFloat(lon).toFixed(5)}`;
                try {
                    if (!userWalletConnected) {
                        alert("Please connect your wallet first.");
                        return;
                    }

                    const provider = new ethers.providers.Web3Provider(window.ethereum);
                    const signer = provider.getSigner();
                    const contract = new ethers.Contract(contractAddress, contractABI, signer);

                    const checkInData = await contract.getCheckIn(location);
                    const now = Math.floor(Date.now() / 1000);
                    const isExpired = checkInData.expiry < now;
                    const fee = isExpired ? ethers.utils.parseUnits("0.00001991", "ether") : checkInData.amount.mul(2);

                    const tx = await contract.checkIn(location, { value: fee });
                    await tx.wait();

                    alert("Check-in successful!");
                    activeCheckIns.set(location, Date.now() + 24 * 60 * 60 * 1000);
                    markLocationAsCheckedIn({ lat: parseFloat(lat), lng: parseFloat(lon) });
                } catch (err) {
                    console.error("Error during check-in:", err);
                    alert("Error: " + err.message);
                }
            });
        }
    });
}

// Позначити локацію як чекіннуту
function markLocationAsCheckedIn(latlng) {
    L.circle(latlng, {
        color: 'green',
        fillColor: '#0f0',
        fillOpacity: 0.5,
        radius: 500
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

