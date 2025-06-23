window.onload = function () {
  const balanceBtn = document.getElementById("balance");
  const input = document.getElementById("nfcTagInput");

  // Load saved tag from localStorage
  const savedTag = localStorage.getItem("nfcTagId");
  if (savedTag) {
    input.value = savedTag;
  }

  balanceBtn.addEventListener("click", async function (event) {
    event.preventDefault();

    const nfcTagId = input.value.trim();

    if (!nfcTagId) {
      alert("Please enter your NFC Tag ID.");
      return;
    }

    // Save tag to localStorage
    localStorage.setItem("nfcTagId", nfcTagId);

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nfcTagId }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Something went wrong.");
        return;
      }

      alert(`Balance for tag "${nfcTagId}": ${data.user.balance}`);
    } catch (err) {
      console.error(err);
      alert("Network error: Could not reach the server.");
    }
  });
};
