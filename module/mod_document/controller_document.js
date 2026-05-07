const fs = require("fs");
const path = require("path");
const modele = require("./modele_document");
const historiqueModele = require("../mod_historique/modele_historique");

exports.upload = async (req, res) => {
    const {contrat_id} = req.body;
    try {
        if (!req.file) {
            return res.json({message:"Aucun fichier sélectionné ou type non autorisé"});
        } else if (!contrat_id) {
            return res.json({message:"Contrat introuvable"});
        } else {
            const nom_fichier = req.file.originalname;
            const chemin = req.file.path;
            const type = req.file.mimetype;
            await modele.ajouterDocument(nom_fichier, chemin, type, contrat_id);
            await historiqueModele.ajouterHistorique(
                "upload",
                "Document ajouté : " + nom_fichier,
                contrat_id,
                req.session.user.id
            );
            return res.json({message:"Document ajouté avec succès"});
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({message:"Erreur upload document"});
    }
};

exports.getByContrat = async (req, res) => {
    const {id} = req.params;
    try {
        const documents = await modele.getDocumentsByContrat(id);
        return res.json(documents);
    } catch (err) {
        console.error(err);
        return res.status(500).json({message:"Erreur récupération documents"});
    }
};

exports.telecharger = async (req, res) => {
    const {id} = req.params;
    try {
        const document = await modele.getDocumentById(id);

        if (!document) {
            return res.json({message:"Document introuvable"});
        } else {
            return res.download(path.resolve(document.chemin), document.nom_fichier);
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({message:"Erreur téléchargement document"});
    }
};

exports.supprimer = async (req, res) => {
    const {id} = req.params;
    try {
        const document = await modele.getDocumentById(id);
        if (!document) {
            return res.json({message:"Document introuvable"});
        } else {
            if (fs.existsSync(document.chemin)) {
                fs.unlinkSync(document.chemin);
            }
            await modele.supprimerDocument(id);
            await historiqueModele.ajouterHistorique(
                "suppression_document",
                "Document supprimé : " + document.nom_fichier,
                document.contrat_id,
                req.session.user.id
            );
            return res.json({message:"Document supprimé avec succès"});
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({message:"Erreur suppression document"});
    }
};

exports.getMesDocuments = async (req, res) => {
    try {
        const documents = await modele.getDocumentsUtilisateur(req.session.user.id);
        return res.json(documents);
    } catch (err) {
        console.error(err);
        return res.status(500).json({message:"Erreur récupération documents utilisateur"});
    }
};

exports.telechargerUtilisateur = async (req, res) => {
    const {id} = req.params;
    try {
        const document = await modele.getDocumentUtilisateurById(id, req.session.user.id);
        if (!document) {
            return res.status(403).json({message:"Accès refusé"});
        } else {
            return res.download(path.resolve(document.chemin), document.nom_fichier);
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({message:"Erreur téléchargement document"});
    }
};
