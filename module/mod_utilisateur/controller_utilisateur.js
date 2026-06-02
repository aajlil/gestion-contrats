const modele = require("./modele_utilisateur");
const bcrypt = require("bcrypt");

exports.getUtilisateurs = async (req, res) => {
    try {
        const utilisateurs = await modele.getUtilisateurs();
        res.json(utilisateurs);
    } catch (err) {
        console.error(err);
        res.status(500).json({message:"Erreur récupération utilisateurs"});
    }
};


exports.modifierRole = async (req, res) => {
    const {id, role_id} = req.body;
    try {
        const utilisateur = await modele.getUtilisateurById(id);
        if (!id || !role_id) {
            return res.json({message: "Champs manquants"});
        }
        else if (!utilisateur) {
            return res.json({message:"Utilisateur introuvable"});
        }
        else if (role_id !== 1 && role_id !== 2) {
            return res.json({message: "Rôle invalide"});
        }
        else if (req.session.user.id == id && role_id !== 1) {
            return res.json({message: "Impossible de retirer votre propre rôle admin"});
        }
        await modele.modifierRole(id, role_id);
        res.json({message: "Rôle modifié avec succès"});
    } catch (err) {
        console.error(err);
        res.status(500).json({message:"Erreur modification rôle"});
    }
};


exports.modifierMotDePasse = async (req, res) => {
    const {ancien_mdp, nouveau_mdp} = req.body;
    try {
        const utilisateur = await modele.getUtilisateurById(req.session.user.id);
        if (!utilisateur) {
            return res.json({message:"Utilisateur introuvable"});
        } else {
            const match = await bcrypt.compare(ancien_mdp, utilisateur.mdp);
            if (!match) {
                return res.json({message:"Ancien mot de passe incorrect"});
            } else {
                const hash = await bcrypt.hash(nouveau_mdp, 10);
                await modele.modifierMotDePasse(req.session.user.id, hash);
                return res.json({message:"Mot de passe modifié avec succès"});
            }
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({message:"Erreur modification mot de passe"});
    }
};


exports.modifierProfil = async (req, res) => {
    const {nom, prenom, identifiant, email} = req.body;
    try {
        const utilisateur = await modele.getUtilisateurById(req.session.user.id);
        if (!utilisateur) {
            return res.json({message:"Utilisateur introuvable"});
        } else {
            const existIdentifiant = await modele.getUtilisateurByIdentifiant(identifiant);
            const existEmail = await modele.getUtilisateurByEmail(email);
            if (existIdentifiant && existIdentifiant.id_utilisateur !== req.session.user.id) {
                return res.json({message:"Identifiant déjà utilisé"});
            } else if (existEmail && existEmail.id_utilisateur !== req.session.user.id) {
                return res.json({message:"Email déjà utilisé"});
            } else {
                await modele.modifierProfil(
                    req.session.user.id, nom, prenom, identifiant, email
                );
                req.session.user.nom = nom;
                req.session.user.prenom = prenom;
                req.session.user.identifiant = identifiant;
                req.session.user.email = email;
                return res.json({message:"Profil modifié avec succès"});
            }
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({message:"Erreur modification profil"});
    }
};


exports.supprimerCompte = async (req, res) => {
    try {
        await modele.supprimerCompte(req.session.user.id);
        req.session.destroy();
        return res.json({message:"Compte supprimé"});
    } catch (err) {
        console.error(err);
        return res.status(500).json({message:"Erreur suppression compte"});
    }
};
