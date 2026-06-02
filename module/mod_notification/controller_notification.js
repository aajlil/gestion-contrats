const modele = require("./modele_notification");
const mailService = require("./service_mail");

function calculerJoursRestants(date_fin) {
    const aujourdHui = new Date();
    const dateFin = new Date(date_fin);
    const differenceTemps = dateFin.getTime() - aujourdHui.getTime();
    const differenceJours = Math.ceil(differenceTemps / (1000 * 60 * 60 * 24));
    return differenceJours;
}


function formaterDate(date) {
    return new Date(date).toLocaleDateString("fr-FR");
}


exports.verifierNotifications = async () => {
    try {
        const contrats = await modele.getContratsAvecResponsable();
        for (const contrat of contrats) {
            if (!contrat.email) {
                console.log("Aucun email pour le contrat " + contrat.contrat_nom);
            } else {
                const joursRestants = calculerJoursRestants(contrat.date_fin);
                let seuil = null;
                if (joursRestants < 0) {
                    seuil = "expire";
                } else if (joursRestants <= 30) {
                    seuil = "30";
                } else if (joursRestants <= 90) {
                    seuil = "90";
                }
                if (seuil !== null) {
                    const dejaEnvoye = await modele.verifierDejaEnvoye(contrat.id_contrat, seuil);
                    if (!dejaEnvoye) {
                        if (seuil === "expire") {
                            await mailService.envoyerMail(
                                contrat.email,
                                "Contrat expiré",
                                "Bonjour " + contrat.identifiant + ",\n\n" +
                                "Le contrat \"" + contrat.contrat_nom + "\" est expiré.\n" +
                                "Date de fin : " + formaterDate(contrat.date_fin) + ".\n\n" +
                                "Merci de vérifier son renouvellement."
                            );
                        } else if (seuil === "30") {
                            await mailService.envoyerMail(
                                contrat.email,
                                "Contrat bientôt expiré - alerte 30 jours",
                                "Bonjour " + contrat.identifiant + ",\n\n" +
                                "Le contrat \"" + contrat.contrat_nom + "\" arrive à échéance dans moins de 30 jours.\n" +
                                "Date de fin : " + formaterDate(contrat.date_fin) + ".\n\n" +
                                "Merci de vérifier son renouvellement."
                            );
                        } else if (seuil === "90") {
                            await mailService.envoyerMail(
                                contrat.email,
                                "Contrat arrivant à échéance - alerte 90 jours",
                                "Bonjour " + contrat.identifiant + ",\n\n" +
                                "Le contrat \"" + contrat.contrat_nom + "\" arrive à échéance dans moins de 90 jours.\n" +
                                "Date de fin : " + formaterDate(contrat.date_fin) + ".\n\n" +
                                "Merci de vérifier son renouvellement."
                            );
                        }
                        await modele.marquerEnvoye(contrat.id_contrat, seuil);
                        console.log("Mail envoyé pour " + contrat.contrat_nom + " - seuil " + seuil);
                    }
                }
            }
        }
        console.log("Verification des notifications terminee");
    } catch (err) {
        console.error("Erreur notifications email :", err);
    }
};


exports.testerNotifications = async (req, res) => {
    try {
        await exports.verifierNotifications();
        return res.json({message:"Test notifications terminé"});
    } catch (err) {
        console.error(err);
        return res.status(500).json({message:"Erreur test notifications"});
    }
};