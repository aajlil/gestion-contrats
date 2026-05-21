(function () {
    var DUREE_AUTO_FERMETURE = 5000;
    var timerFermeture = null;

    function construireLibelle(contrat) {
        var jours = contrat.jours_restants;
        var classe = "";
        var badge = "";
        var label = "";
        if (contrat.statut === "expire") {
            var depuisJours = Math.abs(jours);
            classe = "expire";
            badge = "🔴";
            label = "Expiré depuis " + depuisJours + " jour(s)";
        } else if (jours <= 30) {
            classe = "bientot_expire_30";
            badge = "🟠";
            label = jours + " jour(s) restant(s)";
        } else {
            classe = "bientot_expire_90";
            badge = "🟡";
            label = jours + " jours restants";
        }
        return {classe: classe, badge: badge, label: label};
    }

    function remplirListe(contrats) {
        var liste = document.getElementById("alertes-liste");
        liste.innerHTML = "";
        if (contrats.length === 0) {
            var vide = document.createElement("div");
            vide.className = "alertes-vide";
            vide.innerHTML = "<span>✅</span> Aucun contrat expiré ou bientôt expiré.";
            liste.appendChild(vide);
        } else {
            for (var i = 0; i < contrats.length; i++) {
                var c = contrats[i];
                var info = construireLibelle(c);
                var item = document.createElement("div");
                item.className = "alerte-item " + info.classe;
                item.style.animationDelay = (i * 60) + "ms";
                var badge = document.createElement("span");
                badge.className = "alerte-badge";
                badge.textContent = info.badge;
                var infoDiv = document.createElement("div");
                infoDiv.className = "alerte-info";
                var nom = document.createElement("div");
                nom.className = "alerte-nom";
                nom.textContent = c.nom;
                infoDiv.appendChild(nom);

                if (c.fournisseur) {
                    var fourn = document.createElement("div");
                    fourn.className = "alerte-fournisseur";
                    fourn.textContent = "Fournisseur : " + c.fournisseur;
                    infoDiv.appendChild(fourn);
                }

                var statutLabel = document.createElement("span");
                statutLabel.className = "alerte-statut-label";
                statutLabel.textContent = info.label;
                item.appendChild(badge);
                item.appendChild(infoDiv);
                item.appendChild(statutLabel);
                liste.appendChild(item);
            }
        }
    }

    function afficherAlertes(contrats) {
        remplirListe(contrats);
        var overlay = document.getElementById("alertes-overlay");
        overlay.classList.remove("fermeture");
        overlay.style.display = "flex";
        clearTimeout(timerFermeture);
        timerFermeture = setTimeout(function () {
            fermerAlertes();
        }, DUREE_AUTO_FERMETURE);
    }

    window.fermerAlertes = function () {
        var overlay = document.getElementById("alertes-overlay");
        overlay.classList.add("fermeture");
        setTimeout(function () {
            overlay.style.display = "none";
            overlay.classList.remove("fermeture");
        }, 500);
    };

    async function chargerAlertes() {
        var resUser = await fetch("http://localhost:3000/me");
        var user = await resUser.json();
        var route = "http://localhost:3000/alertes-expiration-utilisateur";
        if (user.role === 1) {
            route = "http://localhost:3000/alertes-expiration";
        }

        var resAlertes = await fetch(route);
        var contrats = await resAlertes.json();
        afficherAlertes(contrats);
    }

    window.ouvrirAlertes = function () {
        chargerAlertes();
        var overlay = document.getElementById("alertes-overlay");
        overlay.style.display = "flex";
    };

    document.addEventListener("DOMContentLoaded", function () {
        var dejaVu = sessionStorage.getItem("alertes_deja_affichees");
        if (!dejaVu) {
            chargerAlertes();
            setTimeout(function () {
                sessionStorage.setItem("alertes_deja_affichees", "1");
            }, 1000);
        }

    });

})();