const forgotForm = document.getElementById("forgotForm");

forgotForm.addEventListener("submit", async function(e) {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const res = await fetch("http://localhost:3000/mot-de-passe-oublie", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({email})
    });

    const data = await res.json();
    document.getElementById("message").textContent = data.message;
});