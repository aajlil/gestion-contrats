const pool = require("../../db");

exports.getUtilisateurs = async () => {
    const result = await pool.query(
        "SELECT id_utilisateur, nom, prenom, identifiant, email, role_id FROM utilisateur");
    return result.rows;
};


exports.getUtilisateurById = async (id) => {
    const result = await pool.query("SELECT * FROM utilisateur WHERE id_utilisateur = $1", [id]);
    return result.rows[0];
};


exports.modifierRole = async (id, role_id) => {
    await pool.query("UPDATE utilisateur SET role_id = $1 WHERE id_utilisateur = $2", [role_id, id]);
};


exports.getUtilisateurById = async (id) => {
    const result = await pool.query("SELECT * FROM utilisateur WHERE id_utilisateur = $1", [id]);
    return result.rows[0];
};


exports.modifierMotDePasse = async (id, mdp) => {
    await pool.query("UPDATE utilisateur SET mdp = $1 WHERE id_utilisateur = $2", [mdp, id]);
};


exports.modifierProfil = async (id, nom, prenom, identifiant, email) => {
    await pool.query(
        "UPDATE utilisateur SET nom = $1, prenom = $2, identifiant = $3, email = $4 WHERE id_utilisateur = $5",
        [nom, prenom, identifiant, email, id]
    );
};


exports.getUtilisateurByIdentifiant = async (identifiant) => {
    const result = await pool.query(
        "SELECT * FROM utilisateur WHERE identifiant = $1", [identifiant]);
    return result.rows[0];
};


exports.getUtilisateurByEmail = async (email) => {
    const result = await pool.query(
        "SELECT * FROM utilisateur WHERE email = $1", [email]);
    return result.rows[0];
};
