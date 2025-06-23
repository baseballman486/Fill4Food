window.onload = function () {
  const input = document.getElementById("rfidInput");
  const btn = document.getElementById("uploadBtn");
  const statusDiv = document.getElementById("status");
  btn.addEventListener("click", async () => {
    const rfidCode = input.value.trim();
    if (!rfidCode) return alert("Enter RFID code");
    statusDiv.textContent = "Uploading...";
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rfidCode })
      });
      const data = await res.json();
      statusDiv.textContent = res.ok ? `Success!` : `Error: ${data.error}`;
    } catch (err) { statusDiv.textContent = "Server error"; }
  });
};