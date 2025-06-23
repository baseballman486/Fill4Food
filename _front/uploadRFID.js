window.onload = function () {
  const input = document.getElementById("rfidInput");
  const btn = document.getElementById("uploadBtn");
  const statusDiv = document.getElementById("status");

  btn.addEventListener("click", async () => {
    const rfidCode = input.value.trim();

    if (!rfidCode) {
      alert("Please enter an RFID code.");
      return;
    }

    statusDiv.textContent = "Uploading...";

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rfidCode }),
      });

      const data = await res.json();

      if (!res.ok) {
        statusDiv.textContent = `Error: ${data.error}`;
        return;
      }

      statusDiv.textContent = `Success! Your assigned code: ${data.code}`;
    } catch (err) {
      console.error(err);
      statusDiv.textContent = "Server error, please try again.";
    }
  });
};
