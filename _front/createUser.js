window.onload = function () {
  const btn = document.getElementById("createUserBtn");
  const input = document.getElementById("nfcTagInput");

  btn.addEventListener("click", async () => {
    const nfcTagId = input.value.trim();
    if (!nfcTagId) return alert("Please enter a tag ID");

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nfcTagId }),
      });

      const data = await res.json();

      if (!res.ok) return alert(data.error || "Error creating user");

      alert(`User created! Your 14-digit code: ${data.code}`);
    } catch (err) {
      console.error(err);
      alert("Server error.");
    }
  });
};
