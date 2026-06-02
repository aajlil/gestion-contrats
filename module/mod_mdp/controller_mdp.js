const bcrypt = require("bcrypt");
const crypto = require("crypto");
const modele = require("./modele_mdp");
const mailService = require("../mod_notification/service_mail");

exports.demandeReset = async (req, res) => {
    const {email} = req.body;
    try {
        const user = await modele.getUserByEmail(email);
        if (!user) {
            return res.json({message:"Si cet email existe, un lien de réinitialisation a été envoyé"});
        } else {
            const token = crypto.randomBytes(32).toString("hex");
            await modele.enregistrerToken(user.id_utilisateur, token);
            const lien = process.env.APP_URL + "/reset_mdp.html?token=" + token;
            await mailService.envoyerMail(
                user.email,
                "Réinitialisation du mot de passe",
                "Bonjour " + user.identifiant + ",\n\n" +
                "Cliquez sur ce lien pour modifier votre mot de passe :\n" +
                lien + "\n\n" +
                "Ce lien expire dans 15 minutes."
            );
            return res.json({message:"Si cet email existe, un lien de réinitialisation a été envoyé"});
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({message:"Erreur demande de réinitialisation"});
    }
};


exports.resetMdp = async (req, res) => {
    const {token, mdp} = req.body;
    try {
        const user = await modele.getUserByResetToken(token);
        if (!user) {
            return res.json({message:"Lien invalide ou expiré"});
        } else {
            const hash = await bcrypt.hash(mdp, 10);
            await modele.modifierMotDePasse(user.id_utilisateur, hash);
            return res.json({message:"Mot de passe modifié avec succès"});
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({message:"Erreur modification mot de passe"});
    }
};