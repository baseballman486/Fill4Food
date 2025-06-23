window.onload = function () {
  const btn = document.getElementById("checkBalanceBtn");
  const input = document.getElementById("nfcTagInput");
  const saved = localStorage.getItem("nfcTagId");
  if (saved) input.value = saved;
  btn.addEventListener("click", async () => {
    const nfcTagId = input.value.trim();
    if (!nfcTagId) return alert("Enter NFC Tag ID");
    localStorage.setItem("nfcTagId", nfcTagId);
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nfcTagId })
      });
      const data = await res.json();
      if (!res.ok) return alert(data.error || "Error");
      alert(`Balance: ${data.user.balance}`);
    } catch (err) { alert("Network error."); }
  });
};