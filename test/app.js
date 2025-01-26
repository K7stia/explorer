document.getElementById("connect").addEventListener("click", async () => {
    const statusElement = document.getElementById("status");
    const addressElement = document.getElementById("address");

    // Перевірка, чи доступний MetaMask
    if (typeof window.ethereum === "undefined") {
        alert("MetaMask is not detected. Please install MetaMask to continue.");
        statusElement.textContent = "Status: MetaMask not detected";
        return;
    }

    try {
        // Запит на підключення до гаманця
        await window.ethereum.request({ method: "eth_requestAccounts" });
        statusElement.textContent = "Status: Wallet connected";

        // Ініціалізація провайдера
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        // Отримання адреси гаманця
        const address = await signer.getAddress();
        addressElement.textContent = `Connected wallet address: ${address}`;
        console.log("Wallet address:", address);
    } catch (err) {
        console.error("Error connecting wallet:", err);
        alert("Failed to connect wallet. Check the console for details.");
        statusElement.textContent = "Status: Connection failed";
    }
});
