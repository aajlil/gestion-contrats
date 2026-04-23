const modele = require("./modele_contrat");

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
        const statut = calculerStatut(date_fin);
        await modele.updateContrat(id, nom, date_debut, date_fin, montant, description, statut);
        res.json({message:"Contrat modifié avec succès"});
        
    } catch (err) {
        console.error(err);
        res.status(500).json({message:"Erreur modification contrat"});
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

