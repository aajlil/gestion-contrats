const btnLogoutUtilisateur = document.getElementById("btnLogout");

async function chargerUser() {
    const res = await fetch("http://localhost:3000/me");
    const user = await res.json();

    if (!user) {
        window.location.href = "/connexion.html";
    } else {
        document.getElementById("welcome").textContent = "Bienvenue " + user.identifiant;
    }
}

function logout() {
    sessionStorage.removeItem("alertes_deja_affichees");
    fetch("http://localhost:3000/logout")
        .then(() => {
            window.location.href = "/connexion.html";
        });
}

async function chargerDashboardUtilisateur() {
    const res = await fetch("http://localhost:3000/dashboard-utilisateur-data");
    const data = await res.json();
    document.getElementById("totalContrats").textContent = data.total;
    document.getElementById("contratsActifs").textContent = data.actifs;
    document.getElementById("contratsExpires").textContent = data.expires;
    document.getElementById("contratsEcheance").textContent = data.echeance;
    const ctx = document.getElementById("graphiqueContrats");
    new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["Total", "Actifs", "Expirés", "Arrivant à échéance"],
            datasets: [{
                label: "Mes contrats",
                data: [data.total, data.actifs, data.expires, data.echeance]
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        precision: 0
                    }
                }
            }
        }
    });
}

async function chargerStatistiquesUtilisateur() {
    const res = await fetch("http://localhost:3000/statistiques-utilisateur-data");
    const data = await res.json();
    document.getElementById("montantTotal").textContent = data.montantTotal;
    const labelsFournisseurs = [];
    const valeursFournisseurs = [];
    data.contratsParFournisseur.forEach(function(item) {
        labelsFournisseurs.push(item.fournisseur || "Non renseigné");
        valeursFournisseurs.push(Number(item.total));
    });

    const labelsTypes = [];
    const valeursTypes = [];
    data.contratsParType.forEach(function(item) {
        labelsTypes.push(item.type_contrat || "Non renseigné");
        valeursTypes.push(Number(item.total));
    });

    const ctxFournisseurs = document.getElementById("graphiqueFournisseurs");
    const ctxTypes = document.getElementById("graphiqueTypes");
    new Chart(ctxFournisseurs, {
        type: "bar",
        data: {
            labels: labelsFournisseurs,
            datasets: [{
                label: "Mes contrats par fournisseur",
                data: valeursFournisseurs
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        precision: 0
                    }
                }
            }
        }
    });

    new Chart(ctxTypes, {
        type: "pie",
        data: {
            labels: labelsTypes,
            datasets: [{
                label: "Mes contrats par type",
                data: valeursTypes
            }]
        }
    });
}

if (btnLogoutUtilisateur) {
    btnLogoutUtilisateur.addEventListener("click", logout);
}

chargerUser();
chargerDashboardUtilisateur();
chargerStatistiquesUtilisateur();