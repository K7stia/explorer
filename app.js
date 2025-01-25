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
