let dateCourante = new Date();
let contratsCalendrier = [];

async function verifierConnexion() {
    const res = await fetch("http://localhost:3000/me");
    const user = await res.json();

    if (!user) {
        window.location.href = "/connexion.html";
    }
}

function formaterStatut(statut) {
    if (statut === "actif") {
        return "Actif";
    } else if (statut === "expire") {
        return "Expiré";
    } else if (statut === "bientot_expire") {
        return "Bientôt expiré";
    } else {
        return "Non renseigné";
    }
}

function formaterDate(date) {
    return new Date(date).toLocaleDateString("fr-FR");
}

function getNomMois(mois) {
    const moisNoms = [
        "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
        "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
    ];

    return moisNoms[mois];
}

async function chargerContratsCalendrier() {
    const res = await fetch("http://localhost:3000/calendrier-contrats");
    contratsCalendrier = await res.json();
    afficherCalendrier();
}

function getContratsDuJour(annee, mois, jour) {
    return contratsCalendrier.filter(function(c) {
        const dateFin = new Date(c.date_fin);

        return dateFin.getFullYear() === annee &&
            dateFin.getMonth() === mois &&
            dateFin.getDate() === jour;
    });
}

function afficherCalendrier() {
    const calendrier = document.getElementById("calendrier");
    calendrier.innerHTML = "";
    const annee = dateCourante.getFullYear();
    const mois = dateCourante.getMonth();

    document.getElementById("titreMois").textContent = getNomMois(mois) + " " + annee;

    const premierJour = new Date(annee, mois, 1);
    const dernierJour = new Date(annee, mois + 1, 0);

    let debutSemaine = premierJour.getDay();
    if (debutSemaine === 0) {
        debutSemaine = 7;
    }

    const joursMois = dernierJour.getDate();
    const nomsJours = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
    const ligneJours = document.createElement("div");

    nomsJours.forEach(function(jour) {
        const caseJour = document.createElement("span");
        caseJour.textContent = jour + "   ";
        ligneJours.appendChild(caseJour);
    });

    calendrier.appendChild(ligneJours);
    calendrier.appendChild(document.createElement("br"));

    let ligne = document.createElement("div");

    for (let i = 1; i < debutSemaine; i++) {
        const caseVide = document.createElement("span");
        caseVide.textContent = "";
        ligne.appendChild(caseVide);
    }

    for (let jour = 1; jour <= joursMois; jour++) {
        const blocJour = document.createElement("div");
        const contratsDuJour = getContratsDuJour(annee, mois, jour);

        blocJour.innerHTML = "<strong>" + jour + "</strong>";

        contratsDuJour.forEach(function(c) {
            const contrat = document.createElement("div");
            contrat.textContent =
                c.nom + " - " + (c.fournisseur || "Sans fournisseur") + " - " + formaterStatut(c.statut);
            blocJour.appendChild(contrat);
        });

        ligne.appendChild(blocJour);
        ligne.appendChild(document.createTextNode("   "));

        if ((jour + debutSemaine - 1) % 7 === 0) {
            calendrier.appendChild(ligne);
            calendrier.appendChild(document.createElement("hr"));
            ligne = document.createElement("div");
        }
    }

    if (ligne.childNodes.length > 0) {
        calendrier.appendChild(ligne);
    }
}

document.getElementById("btnPrecedent").addEventListener("click", function() {
    dateCourante.setMonth(dateCourante.getMonth() - 1);
    afficherCalendrier();
});

document.getElementById("btnSuivant").addEventListener("click", function() {
    dateCourante.setMonth(dateCourante.getMonth() + 1);
    afficherCalendrier();
});

document.getElementById("btnRetour").addEventListener("click", async function() {
    const res = await fetch("http://localhost:3000/me");
    const user = await res.json();

    if (user.role === 1) {
        window.location.href = "/dashboard_admin.html";
    } else {
        window.location.href = "/dashboard_utilisateur.html";
    }
});

verifierConnexion();
chargerContratsCalendrier();
