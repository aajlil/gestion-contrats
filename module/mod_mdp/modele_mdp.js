const pool = require("../../db");

exports.getUserByEmail = async (email) => {
    const result = await pool.query("SELECT * FROM utilisateur WHERE email = $1", [email]);
    return result.rows[0];
};

exports.enregistrerToken = async (id_utilisateur, token) => {
    await pool.query(
        "UPDATE utilisateur SET reset_token = $1, reset_expire = NOW() + INTERVAL '15 minutes' WHERE id_utilisateur = $2",
        [token, id_utilisateur]
    );
};

exports.getUserByResetToken = async (token) => {
    const result = await pool.query(
        "SELECT * FROM utilisateur WHERE reset_token = $1 AND reset_expire > NOW()", [token]);
    return result.rows[0];
};

exports.modifierMotDePasse = async (id_utilisateur, mdp) => {
    await pool.query(
        "UPDATE utilisateur SET mdp = $1, reset_token = NULL, reset_expire = NULL WHERE id_utilisateur = $2",
        [mdp, id_utilisateur]
    );
};