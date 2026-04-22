const btnAjouterType = document.getElementById("btnAjouterType");

async function verifierAdmin() {
    const res = await fetch("http://localhost:3000/me");
    const user = await res.json();

    if (!user) {
        window.location.href = "/connexion.html";
    } else if (user.role !== 1) {
        window.location.href = "/dashboard_utilisateur.html";
    }
}

async function ajouterType() {
    const nom = document.getElementById("nom").value;

    const res = await fetch("http://localhost:3000/types", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ nom })
    });

    const data = await res.json();
    document.getElementById("message").textContent = data.message;
}

if (btnAjouterType) {
    btnAjouterType.addEventListener("click", ajouterType);
}

verifierAdmin();
