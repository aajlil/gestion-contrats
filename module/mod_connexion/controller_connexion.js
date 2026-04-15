const bcrypt = require("bcrypt");
const modele = require("./modele_connexion");

exports.inscription = async (req, res) => {
    const {nom, prenom, identifiant, email, mdp} = req.body;
    const existIdentifiant = await modele.getUserByIdentifiant(identifiant);

    try {
        const exist = await modele.getUserByEmail(email);

        if (exist) {
            return res.json({message: "Email déja utilisé"});
        }

        else if (existIdentifiant) {
            return res.json({message: "Identifiant déjà utilisé"});
        }

        const hash = await bcrypt.hash(mdp, 10);

        await modele.creerUtilisateur(nom, prenom, identifiant, email, hash);

        res.json({message: "Inscription réussie !"});
    } catch (err) {
        console.error(err);
        res.status(500).send("Erreur inscription");
    }
};

exports.login = async (req, res) => {
    const { login, mdp } = req.body;

    try {
        const user = await modele.getUserByIdentifiant(login);
        const match = await bcrypt.compare(mdp, user.mdp);

        if (!user) {
            return res.json({message: "Utilisateur introuvable"});
        }

        else if (!match) {
            return res.json({message:"Mot de passe incorrect"});
        }

        req.session.user = {
            id: user.id_utilisateur,
            identifiant: user.identifiant,
            role: user.role_id
        };

        res.json({message: "Connexion réussie !", role: user.role_id});

    } catch (err) {
        console.error(err);
        res.status(500).json({message: "Erreur connexion"});
    }
};