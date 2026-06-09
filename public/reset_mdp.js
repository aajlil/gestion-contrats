const resetForm = document.getElementById("resetForm");

resetForm.addEventListener("submit", async function(e) {
    e.preventDefault();
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const mdp = document.getElementById("mdp").value;
    const confirmation = document.getElementById("confirmation").value;
    if (!token) {
        document.getElementById("message").textContent = "Lien invalide";
    } else if (mdp !== confirmation) {
        document.getElementById("message").textContent = "Les mots de passe ne correspondent pas";
    } else {
        const res = await fetch("/reset-mot-de-passe", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({token, mdp})
        });

        const data = await res.json();
        document.getElementById("message").textContent = data.message;
    }
});