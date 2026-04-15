const modele = require("./modele_contrat");

exports.create = async (req, res) => {
    const {nom, date_debut, date_fin, montant, description, fournisseur_id, type_id, responsable_id} = req.body;
    try {
        await modele.createContrat(nom, date_debut, date_fin, montant, description, fournisseur_id, type_id, responsable_id);
        res.json({ message: "Contrat créé avec succès" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erreur création contrat" });
    }
};

exports.createFournisseur = async (req, res) => {
    const { nom, email, telephone } = req.body;
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