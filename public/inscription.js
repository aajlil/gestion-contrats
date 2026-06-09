const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const btn = document.getElementById("btnInscription");
        if (btn) {
            btn.disabled = true;
        }
        const identifiant = document.getElementById("identifiant").value;
        const nom = document.getElementById("nom").value;
        const prenom = document.getElementById("prenom").value;
        const email = document.getElementById("email_inscription").value;
        const mdp = document.getElementById("mdp").value;
        const res = await fetch("/inscription", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({nom, prenom, identifiant, email, mdp})
        });
        const data = await res.json();
        document.getElementById("message").textContent = data.message;
        if (btn) {
            btn.disabled = false;
        }
    });
}