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
let loadedMarkers = []; // Для зберігання вже завантажених маркерів

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

// Список найбільших міст України
const staticCities = [
    { name: "Kyiv", lat: 50.4501, lon: 30.5234 },
    { name: "Kharkiv", lat: 49.9935, lon: 36.2304 },
    { name: "Odessa", lat: 46.4825, lon: 30.7233 },
    { name: "Dnipro", lat: 48.4647, lon: 35.0462 },
    { name: "Lviv", lat: 49.8397, lon: 24.0297 },
    { name: "Kryvyi Rih", lat: 47.9105, lon: 33.3918 },
    { name: "Mykolaiv", lat: 46.9750, lon: 31.9946 },
    { name: "Mariupol", lat: 47.0971, lon: 37.5434 },
    { name: "Zaporizhzhia", lat: 47.8388, lon: 35.1396 },
    { name: "Vinnytsia", lat: 49.2331, lon: 28.4682 },
    { name: "Poltava", lat: 49.5883, lon: 34.5514 },
    { name: "Chernihiv", lat: 51.4982, lon: 31.2893 },
    { name: "Kherson", lat: 46.6354, lon: 32.6169 },
    { name: "Cherkasy", lat: 49.4444, lon: 32.0598 },
    { name: "Zhytomyr", lat: 50.2547, lon: 28.6578 },
    { name: "Sumy", lat: 50.9077, lon: 34.7981 },
    { name: "Rivne", lat: 50.6199, lon: 26.2516 },
    { name: "Ivano-Frankivsk", lat: 48.9226, lon: 24.7097 },
    { name: "Ternopil", lat: 49.5535, lon: 25.5892 },
    { name: "Lutsk", lat: 50.7472, lon: 25.3254 },
    { name: "Uzhhorod", lat: 48.6208, lon: 22.2879 },
    { name: "Chernivtsi", lat: 48.2915, lon: 25.9352 }
];

// Ініціалізація карти
let map;
function initializeMap() {
    map = L.map('map').setView([48.3794, 31.1656], 6); // Центр карти: Україна
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    loadStaticCities();
}

// Завантаження статичного списку міст
function loadStaticCities() {
    clearOldMarkers(); // Очистка старих маркерів

    staticCities.forEach((city) => {
        const marker = L.marker([city.lat, city.lon]).addTo(map);
        marker.bindPopup(
            `<strong>${city.name}</strong><br>
            <button class="check-in-btn" data-lat="${city.lat}" data-lon="${city.lon}">Check-In</button>`
        );
        loadedMarkers.push(marker);
    });

    addCheckInHandlers();
}

// Очистка старих маркерів
function clearOldMarkers() {
    loadedMarkers.forEach((marker) => {
        map.removeLayer(marker);
    });
    loadedMarkers = [];
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
                    if (typeof ethers === "undefined") {
                        throw new Error("ethers.js is not loaded. Make sure it is included in your project.");
                    }

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
