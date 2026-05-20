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

if (btnLogoutUtilisateur) {
    btnLogoutUtilisateur.addEventListener("click", logout);
}

chargerUser();
chargerDashboardUtilisateur();