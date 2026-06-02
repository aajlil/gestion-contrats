const pool = require("../../db");

exports.ajouterHistorique = async (action, description, contrat_id, utilisateur_id) => {
    await pool.query(
        "INSERT INTO historique (action, description, contrat_id, utilisateur_id) VALUES ($1, $2, $3, $4)",
        [action, description, contrat_id, utilisateur_id]
    );
};


exports.getHistoriqueByContrat = async (contrat_id) => {
    const result = await pool.query(`
        SELECT
            h.id_historique, h.action, h.description, h.date_action, h.contrat_id, h.utilisateur_id, u.nom, u.prenom
        FROM historique h
        LEFT JOIN utilisateur u ON h.utilisateur_id = u.id_utilisateur
        WHERE h.contrat_id = $1
        ORDER BY h.date_action DESC`, [contrat_id]);
    return result.rows;
};
