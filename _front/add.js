window.onload = function () {
  const tagInput = document.getElementById("nfcTagInput");
  const amtInput = document.getElementById("amountInput");
  const btn = document.getElementById("addBalanceBtn");

  const saved = localStorage.getItem("nfcTagId");
  if (saved) tagInput.value = saved;

  btn.addEventListener("click", async () => {
    const nfcTagId = tagInput.value.trim();
    const amount = parseInt(amtInput.value);

    if (!nfcTagId || isNaN(amount)) {
      return alert("Enter a valid NFC Tag ID and amount.");
    }

    localStorage.setItem("nfcTagId", nfcTagId);

    try {
      const res = await fetch("http://localhost:5000/api/redemption/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nfcTagId, amount }),
      });

      const data = await res.json();
      if (!res.ok) return alert(data.error || "Failed to add balance");

      alert(`Balance successfully updated! New balance: ${data.newBalance}`);
    } catch (err) {
      console.error(err);
      alert("Server connection error.");
    }
  });
};
