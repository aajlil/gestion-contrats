const modele = require("./modele_utilisateur");

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
