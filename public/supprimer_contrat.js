let idsSelectionnes = [];

document.getElementById("btnSupprimer").addEventListener("click", supprimer);
document.getElementById("btnOui").addEventListener("click", confirmerSuppression);
document.getElementById("btnNon").addEventListener("click", annulerSuppression);

async function verifierAdmin() {
    const res = await fetch("http://localhost:3000/me");
    const user = await res.json();

    if (!user) {
        window.location.href = "/connexion.html";
    } else if (user.role !== 1) {
        window.location.href = "/dashboard_utilisateur.html";
    }
}

async function chargerContrats() {
    const res = await fetch("http://localhost:3000/contrats");
    const contrats = await res.json();

    const div = document.getElementById("liste");
    div.innerHTML = "";

    contrats.forEach(function(c) {
        const ligne = document.createElement("div");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = c.id_contrat;

        const texte = document.createTextNode(
            c.nom + " - " + c.montant + "€" + " - " + c.description
        );

        ligne.appendChild(checkbox);
        ligne.appendChild(texte);
        div.appendChild(ligne);
    });
}

function supprimer() {
    const checkboxes = document.querySelectorAll("input[type='checkbox']:checked");
    idsSelectionnes = [];

    checkboxes.forEach(function(cb) {
        idsSelectionnes.push(cb.value);
    });

    if (idsSelectionnes.length === 0) {
        document.getElementById("message").textContent = "Sélectionne au moins un contrat";
    } else {
        document.getElementById("confirmationBox").classList.remove("cache");
    }
}

async function confirmerSuppression() {
    const res = await fetch("http://localhost:3000/contrats", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ids: idsSelectionnes})
    });

    const data = await res.json();
    document.getElementById("message").textContent = data.message;
    document.getElementById("confirmationBox");
    chargerContrats();
}

function annulerSuppression() {
    document.getElementById("confirmationBox");
}

verifierAdmin();
chargerContrats();