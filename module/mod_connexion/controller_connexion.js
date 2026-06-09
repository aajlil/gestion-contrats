const bcrypt = require("bcrypt");
const modele = require("./modele_connexion");
const crypto = require("crypto");
const mailService = require("../mod_notification/service_mail");

exports.inscription = async (req, res) => {
    const {nom, prenom, identifiant, email, mdp} = req.body;
    try {
        const existEmail = await modele.getUserByEmail(email);
        const existIdentifiant = await modele.getUserByIdentifiant(identifiant);
        if (existEmail) {
            return res.json({message:"Email déjà utilisé"});
        } else if (existIdentifiant) {
            return res.json({message:"Identifiant déjà utilisé"});
        } else {
            const hash = await bcrypt.hash(mdp, 10);
            const token = crypto.randomBytes(32).toString("hex");
            await modele.creerUtilisateur(nom, prenom, identifiant, email, hash, token);
            const lien = process.env.APP_URL + "/confirmer-inscription?token=" + token;
            res.json({message: "Un email de confirmation vous a été envoyé"});
            mailService.envoyerMail(
                email,
                "Confirmation de votre inscription",
                "Bonjour " + prenom + ",\n\n" +
                "Cliquez sur le lien suivant pour confirmer la création de votre compte :\n\n" + lien + "\n\n" +
                "Ce lien expire dans 30 minutes."
            ).catch(err => console.error("Erreur envoi mail :", err));
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({message:"Erreur inscription"});
    }
};


exports.login = async (req, res) => {
    const {login, mdp} = req.body;
    try {
        const user = await modele.getUserByIdentifiant(login);
        if (!user) {
            return res.json({message:"Utilisateur introuvable"});
        } else {
            if (!user.compte_actif) {
                return res.json({message: "Veuillez confirmer votre adresse email avant de vous connecter"});
            }
            const match = await bcrypt.compare(mdp, user.mdp);
            if (!match) {
                return res.json({message: "Mot de passe incorrect"});
            } else {
                req.session.user = {
                    id: user.id_utilisateur,
                    identifiant: user.identifiant,
                    nom: user.nom,
                    prenom: user.prenom,
                    email: user.email,
                    role: user.role_id
                };
                return res.json({
                    message: "Connexion réussie !",
                    role: user.role_id
                });
            }
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({message:"Erreur connexion"});
    }
};

exports.confirmerInscription = async (req, res) => {
    const {token} = req.query;
    try {
        const user = await modele.getUserByConfirmationToken(token);
        if (!user) {
            return res.send("<h1>Lien invalide ou expiré</h1>");
        }
        await modele.activerCompte(user.id_utilisateur);
        return res.sendFile(require("path").join(__dirname, "../../public/confirmation_inscription.html"));
    }
    catch (err) {
        console.error(err);
        return res.status(500).send("Erreur confirmation");
    }
};

