async function chargerListe() {
    const res = await fetch("http://localhost:3000/contrats");
    const contrats = await res.json();
    const select = document.getElementById("contrat_select");
    contrats.forEach(function(c) {
        const option = document.createElement("option");
        option.value = c.id_contrat;
        option.textContent = c.nom;
        select.appendChild(option);
    });
}


async function chargerContrat() {
    const id = document.getElementById("contrat_select").value;
    const res = await fetch("http://localhost:3000/contrats");
    const contrats = await res.json();
    const contrat = contrats.find(c => c.id_contrat == id);

    document.getElementById("nom").value = contrat.nom;
    document.getElementById("date_debut").value = contrat.date_debut.split("T")[0];
    document.getElementById("date_fin").value = contrat.date_fin.split("T")[0];
    document.getElementById("montant").value = contrat.montant;
    document.getElementById("description").value = contrat.description;
}


async function modifier() {
    const id = document.getElementById("contrat_select").value;
    const nom = document.getElementById("nom").value;
    const date_debut = document.getElementById("date_debut").value;
    const date_fin = document.getElementById("date_fin").value;
    const montant = document.getElementById("montant").value;
    const description = document.getElementById("description").value;
    const res = await fetch("http://localhost:3000/contrats", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id, nom, date_debut, date_fin, montant, description
        })
    });
    const data = await res.json();
    document.getElementById("message").textContent = data.message;
}

chargerListe();