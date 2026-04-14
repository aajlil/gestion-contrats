const bcrypt = require("bcrypt");
const modele = require("./modele_connexion");

exports.inscription = async (req, res) => {
    const { nom, prenom, email, mdp } = req.body;

    try {
        const exist = await modele.getUserByEmail(email);

        if (exist) {
            return res.send("Email déjà utilisé");
        }

        const hash = await bcrypt.hash(mdp, 10);

        await modele.createUser(nom, prenom, email, hash);

        res.send("Inscription réussie !");
    } catch (err) {
        console.error(err);
        res.status(500).send("Erreur inscription");
    }
};

exports.login = async (req, res) => {
    const { email, mdp } = req.body;

    try {
        const user = await modele.getUserByEmail(email);

        if (!user) {
            return res.send("Utilisateur introuvable");
        }

        const match = await bcrypt.compare(mdp, user.mdp);

        if (!match) {
            return res.send("Mot de passe incorrect");
        }


        res.send("Connexion réussie !");
    } catch (err) {
        console.error(err);
        res.status(500).send("Erreur connexion");
    }
};