const pool = require("../../db");

exports.getUserByEmail = async (email) => {
    const result = await pool.query(
        "SELECT * FROM utilisateur WHERE email = $1", [email]);
    return result.rows[0];
};


exports.getUserByIdentifiant = async (identifiant) => {
    const result = await pool.query(
        "SELECT * FROM utilisateur WHERE identifiant = $1", [identifiant]);
    return result.rows[0];
};


exports.creerUtilisateur = async (nom, prenom, identifiant, email, mdp) => {
    await pool.query(
        "INSERT INTO utilisateur (nom, prenom, identifiant, email, mdp, role_id) VALUES ($1, $2, $3, $4, $5, 2)",
        [nom, prenom, identifiant, email, mdp]
    );
};