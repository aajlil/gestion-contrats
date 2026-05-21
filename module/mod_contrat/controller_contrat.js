const modele = require("./modele_contrat");
const historiqueModele = require("../mod_historique/modele_historique");


exports.create = async (req, res) => {
    const {nom, date_debut, date_fin, montant, description, fournisseur_id, type_id, responsable_id} = req.body;

    try {
        const statut = calculerStatut(date_fin);
        await modele.createContrat(nom, date_debut, date_fin, montant, description, statut, fournisseur_id, type_id, responsable_id);
        res.json({message:"Contrat créé avec succès"});

    } catch (err) {
        console.error(err);
        res.status(500).json({message:"Erreur création contrat"});
    }
};


exports.createFournisseur = async (req, res) => {
    const {nom, email, telephone} = req.body;
    try {
        await modele.createFournisseur(nom, email, telephone);
        res.json({message:"Fournisseur ajouté avec succès"});
    } catch (err) {
        console.error(err);
        res.status(500).json({message:"Erreur ajout fournisseur"});
    }
};

exports.createType = async (req, res) => {
    const {nom} = req.body;
    try {
        await modele.createType(nom);
        res.json({message:"Type de contrat ajouté avec succès"});
    } catch (err) {
        console.error(err);
        res.status(500).json({message:"Erreur ajout type"});
    }
};


exports.update = async (req, res) => {
    const {id, nom, date_debut, date_fin, montant, description} = req.body;

    try {
        const ancienContrat = await modele.getContratById(id);

        if (!ancienContrat) {
            return res.json({message:"Contrat introuvable"});
        } else {
            const statut = calculerStatut(date_fin);
            await modele.updateContrat(
                id, nom, date_debut, date_fin, montant, description, statut
            );

            const texteHistorique = construireDescription(ancienContrat, {
                nom, date_debut, date_fin, montant, description, statut
            });

            if (texteHistorique !== "") {
                await historiqueModele.ajouterHistorique(
                    "modification", texteHistorique, id, req.session.user.id
                );
            }
            return res.json({message:"Contrat modifié avec succès"});
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({message:"Erreur modification contrat"});
    }
};





exports.getAll = async (req, res) => {
    try {
        const contrats = await modele.getAllContrats();
        res.json(contrats);
    } catch (err) {
        console.error(err);
        res.status(500).json({message:"Erreur récupération contrats"});
    }
};

exports.getMesContrats = async (req, res) => {
    try {
        const contrats = await modele.getMesContrats(req.session.user.id);
        res.json(contrats);
    } catch (err) {
        console.error(err);
        res.status(500).json({message: "Erreur récupération de vos contrats"});
    }
};

function calculerStatut(date_fin) {
    const aujourdHui = new Date();
    const dateFin = new Date(date_fin);

    const differenceTemps = dateFin.getTime() - aujourdHui.getTime();
    const differenceJours = differenceTemps / (1000 * 60 * 60 * 24);

    if (differenceJours < 0) {
        return "expire";
    } else if (differenceJours <= 90) {
        return "bientot_expire";
    } else {
        return "actif";
    }
}

function construireDescription(ancienContrat, nouveauContrat) {
    let description = "";

    if (ancienContrat.nom != nouveauContrat.nom) {
        description += "Nom modifié : " + ancienContrat.nom + " -> " + nouveauContrat.nom + ". ";
    }

    if (formaterDate(ancienContrat.date_debut) != nouveauContrat.date_debut) {
        description += "Date de début modifiée : " + formaterDate(ancienContrat.date_debut) + " -> " + nouveauContrat.date_debut + ". ";
    }

    if (formaterDate(ancienContrat.date_fin) != nouveauContrat.date_fin) {
        description += "Date de fin modifiée : " + formaterDate(ancienContrat.date_fin) + " -> " + nouveauContrat.date_fin + ". ";
    }

    if (ancienContrat.montant != nouveauContrat.montant) {
        description += "Montant modifié : " + ancienContrat.montant + " -> " + nouveauContrat.montant + ". ";
    }

    if (ancienContrat.description != nouveauContrat.description) {
        description += "Description modifiée. ";
    }

    if (ancienContrat.statut != nouveauContrat.statut) {
        description += "Statut modifié : " + ancienContrat.statut + " -> " + nouveauContrat.statut + ". ";
    }

    return description;
}

function formaterDate(date) {
    return new Date(date).toISOString().split("T")[0];
}


exports.getCalendrier = async (req, res) => {
    try {
        let contrats;

        if (!req.session.user) {
            return res.status(401).json({message:"Non authentifié"});
        } else if (req.session.user.role === 1) {
            contrats = await modele.getContratsCalendrier();
        } else {
            contrats = await modele.getMesContratsCalendrier(req.session.user.id);
        }

        return res.json(contrats);
    } catch (err) {
        console.error(err);
        return res.status(500).json({message:"Erreur récupération calendrier"});
    }
};

exports.rechercher = async (req, res) => {
    const {recherche} = req.query;
    try {
        if (!recherche) {
            return res.json([]);
        } else {
            const contrats = await modele.rechercherContrats(recherche);
            return res.json(contrats);
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({message:"Erreur recherche contrats"});
    }
};

exports.rechercherMesContrats = async (req, res) => {
    const {recherche} = req.query;
    try {
        if (!recherche) {
            return res.json([]);
        } else {
            const contrats = await modele.rechercherMesContrats(recherche, req.session.user.id);
            return res.json(contrats);
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({message:"Erreur recherche mes contrats"});
    }
};

exports.filtrer = async (req, res) => {
    const fournisseur = req.query.fournisseur || "";
    const type = req.query.type || "";
    const statut = req.query.statut || "";
    const date_fin = req.query.date_fin || "";
    try {
        const contrats = await modele.filtrerContrats(fournisseur, type, statut, date_fin);
        return res.json(contrats);
    } catch (err) {
        console.error(err);
        return res.status(500).json({message:"Erreur filtres contrats"});
    }
};


exports.filtrerMesContrats = async (req, res) => {
    const fournisseur = req.query.fournisseur || "";
    const type = req.query.type || "";
    const statut = req.query.statut || "";
    const date_fin = req.query.date_fin || "";
    try {
        const contrats = await modele.filtrerMesContrats(
            req.session.user.id, fournisseur, type, statut, date_fin
        );
        return res.json(contrats);
    } catch (err) {
        console.error(err);
        return res.status(500).json({message:"Erreur filtres mes contrats"});
    }
};

exports.getDashboard = async (req, res) => {
    try {
        const dashboard = await modele.getDashboardData();
        return res.json(dashboard);
    } catch (err) {
        console.error(err);
        return res.status(500).json({message:"Erreur récupération dashboard"});
    }
};

exports.getDashboardUtilisateur = async (req, res) => {
    try {
        const dashboard = await modele.getDashboardUtilisateurData(req.session.user.id);
        return res.json(dashboard);
    } catch (err) {
        console.error(err);
        return res.status(500).json({message:"Erreur récupération dashboard utilisateur"});
    }
};

exports.getStatistiques = async (req, res) => {
    try {
        const montantTotal = await modele.getMontantTotalContrats();
        const contratsParFournisseur = await modele.getContratsParFournisseur();
        const contratsParType = await modele.getContratsParType();
        return res.json({
            montantTotal: montantTotal,
            contratsParFournisseur: contratsParFournisseur,
            contratsParType: contratsParType
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({message:"Erreur récupération statistiques admin"});
    }
};

exports.getStatistiquesUtilisateur = async (req, res) => {
    try {
        const montantTotal = await modele.getMontantTotalMesContrats(req.session.user.id);
        const contratsParFournisseur = await modele.getMesContratsParFournisseur(req.session.user.id);
        const contratsParType = await modele.getMesContratsParType(req.session.user.id);
        return res.json({
            montantTotal: montantTotal,
            contratsParFournisseur: contratsParFournisseur,
            contratsParType: contratsParType
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({message:"Erreur récupération statistiques utilisateur"});
    }
};

exports.getAlertes = async (req, res) => {
    try {
        const contrats = await modele.getAlertesExpiration();
        return res.json(contrats);
    } catch (err) {
        console.error(err);
        return res.status(500).json({message:"Erreur récupération alertes"});
    }
};

exports.getAlertesUtilisateur = async (req, res) => {
    try {
        const contrats = await modele.getAlertesExpirationUtilisateur(req.session.user.id);
        return res.json(contrats);
    } catch (err) {
        console.error(err);
        return res.status(500).json({message:"Erreur récupération alertes utilisateur"});
    }
};





