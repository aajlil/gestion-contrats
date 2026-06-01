const btnLogout = document.getElementById("btnLogout");

async function chargerUser() {
    const res = await fetch("http://localhost:3000/me");
    const user = await res.json();

    if (!user) {
        window.location.href = "/connexion.html";
    } else if (user.role !== 1) {
        window.location.href = "/dashboard_utilisateur.html";
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

async function chargerDashboard() {
    const res = await fetch("http://localhost:3000/dashboard-data");
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
                label: "Contrats",
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

async function chargerStatistiques() {
    const res = await fetch("http://localhost:3000/statistiques-data");
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
                label: "Contrats par fournisseur",
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
                label: "Contrats par type",
                data: valeursTypes
            }]
        }
    });
}

const btnMenu = document.getElementById("btnMenu");
const btnFermerMenu = document.getElementById("btnFermerMenu");
const menuLateral = document.getElementById("menuLateral");
const menuOverlay = document.getElementById("menuOverlay");
const btnLogoutMenu = document.getElementById("btnLogoutMenu");

function ouvrirMenu() {
    menuLateral.classList.add("ouvert");
    menuOverlay.classList.add("ouvert");
}

function fermerMenu() {
    menuLateral.classList.remove("ouvert");
    menuOverlay.classList.remove("ouvert");
}

if (btnMenu) {
    btnMenu.addEventListener("click", ouvrirMenu);
}

if (btnFermerMenu) {
    btnFermerMenu.addEventListener("click", fermerMenu);
}

if (menuOverlay) {
    menuOverlay.addEventListener("click", fermerMenu);
}

if (btnLogoutMenu) {
    btnLogoutMenu.addEventListener("click", logout);
}

if (btnLogout) {
    btnLogout.addEventListener("click", logout);
}

chargerUser();
chargerDashboard();
chargerStatistiques();