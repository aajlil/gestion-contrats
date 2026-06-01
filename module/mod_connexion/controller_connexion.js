const bcrypt = require("bcrypt");
const modele = require("./modele_connexion");

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
            await modele.creerUtilisateur(nom, prenom, identifiant, email, hash);

            return res.json({message:"Inscription réussie !"});
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
            const match = await bcrypt.compare(mdp, user.mdp);

            if (!match) {
                return res.json({ message: "Mot de passe incorrect" });
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
