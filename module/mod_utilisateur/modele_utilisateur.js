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
