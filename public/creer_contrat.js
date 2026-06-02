const btnCreerContrat = document.getElementById("btnCreerContrat");

async function verifierAdmin() {
    const res = await fetch("http://localhost:3000/me");
    const user = await res.json();
    if (!user) {
        window.location.href = "/connexion.html";
    } else if (user.role !== 1) {
        window.location.href = "/dashboard_utilisateur.html";
    }
}


async function chargerFournisseurs() {
    const res = await fetch("http://localhost:3000/fournisseurs");
    const data = await res.json();
    const select = document.getElementById("fournisseur_id");
    data.forEach(function(f) {
        const option = document.createElement("option");
        option.value = f.id_fournisseur;
        option.textContent = f.nom;
        select.appendChild(option);
    });
}


async function chargerTypes() {
    const res = await fetch("http://localhost:3000/types");
    const data = await res.json();
    const select = document.getElementById("type_id");
    data.forEach(function(t) {
        const option = document.createElement("option");
        option.value = t.id_type_contrat;
        option.textContent = t.nom;
        select.appendChild(option);
    });
}


async function chargerUtilisateurs() {
    const res = await fetch("http://localhost:3000/utilisateurs");
    const data = await res.json();
    const select = document.getElementById("responsable_id");
    data.forEach(function(u) {
        const option = document.createElement("option");
        option.value = u.id_utilisateur;
        option.textContent = u.nom + " " + u.prenom;
        select.appendChild(option);
    });
}


async function creerContrat() {
    const nom = document.getElementById("nom").value;
    const date_debut = document.getElementById("date_debut").value;
    const date_fin = document.getElementById("date_fin").value;
    const montant = document.getElementById("montant").value;
    const description = document.getElementById("description").value;
    const fournisseur_id = document.getElementById("fournisseur_id").value;
    const type_id = document.getElementById("type_id").value;
    const responsable_id = document.getElementById("responsable_id").value;
    const res = await fetch("http://localhost:3000/contrats", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            nom, date_debut, date_fin, montant, description, fournisseur_id, type_id, responsable_id
        })
    });
    const data = await res.json();
    document.getElementById("message").textContent = data.message;
}


if (btnCreerContrat) {
    btnCreerContrat.addEventListener("click", creerContrat);
}

verifierAdmin();
chargerFournisseurs();
chargerTypes();
chargerUtilisateurs();
