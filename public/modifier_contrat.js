let contratId = null;

async function verifierAdmin() {
    const res = await fetch("/me");
    const user = await res.json();
    if (!user) {
        window.location.href = "/connexion.html";
    } else if (user.role !== 1) {
        window.location.href = "/dashboard_utilisateur.html";
    }
}

async function chargerContrat() {
    console.log("chargerContrat OK");
    const params = new URLSearchParams(window.location.search);
    contratId = params.get("id");
    const res = await fetch("/contrats/" + contratId);
    const contrat = await res.json();
    console.log("CONTRAT =", contrat);
    document.getElementById("nom").value = contrat.nom;
    document.getElementById("montant").value = contrat.montant;
    document.getElementById("description").value = contrat.description;
    if (contrat.date_debut) {
        document.getElementById("date_debut").value = contrat.date_debut.split("T")[0];
    }
    if (contrat.date_fin) {
        document.getElementById("date_fin").value = contrat.date_fin.split("T")[0];
    }
}


async function modifier() {
    const id = contratId;
    const nom = document.getElementById("nom").value;
    const date_debut = document.getElementById("date_debut").value;
    const date_fin = document.getElementById("date_fin").value;
    const montant = document.getElementById("montant").value;
    const description = document.getElementById("description").value;
    const res = await fetch("/contrats", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id: contratId, nom: nom, montant: montant, date_debut: date_debut, date_fin: date_fin, description: description
        })
    });
    const data = await res.json();
    document.getElementById("message").textContent = data.message;
}

verifierAdmin()
chargerContrat();