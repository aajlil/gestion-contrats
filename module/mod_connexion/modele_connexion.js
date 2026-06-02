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


exports.creerUtilisateur = async (nom, prenom, identifiant, email, mdp, token) => {
    await pool.query(`INSERT INTO utilisateur(
        nom, prenom, identifiant, email, mdp, role_id, compte_actif, confirmation_token, confirmation_expire) VALUES ($1,$2,$3,$4,$5,2,FALSE,$6, NOW() + INTERVAL '30 minutes')`,
        [nom, prenom, identifiant, email, mdp, token]
    );
};


exports.getUserByConfirmationToken = async (token) => {
    const result = await pool.query(
        `SELECT * FROM utilisateur WHERE confirmation_token = $1 AND confirmation_expire > NOW()`, [token]);
    return result.rows[0];
};

exports.activerCompte = async (id_utilisateur) => {
    await pool.query(`
        UPDATE utilisateur SET compte_actif = TRUE, confirmation_token = NULL, confirmation_expire = NULL
         WHERE id_utilisateur = $1`, [id_utilisateur]);
};