const pool = require("../../db");

exports.getContratsAvecResponsable = async () => {
    const result = await pool.query(
        `SELECT
             c.id_contrat, c.nom AS contrat_nom, c.date_fin, u.id_utilisateur,
             u.nom AS utilisateur_nom, u.prenom AS utilisateur_prenom, u.identifiant, u.email
         FROM contrat c LEFT JOIN utilisateur u ON c.responsable_id = u.id_utilisateur
         WHERE c.date_fin IS NOT NULL`);
    return result.rows;
};

exports.verifierDejaEnvoye = async (contrat_id, seuil) => {
    const result = await pool.query(
        "SELECT id FROM notification_envoyee WHERE contrat_id = $1 AND seuil = $2", [contrat_id, seuil]
    );
    return result.rows.length > 0;
};

exports.marquerEnvoye = async (contrat_id, seuil) => {
    await pool.query(
        "INSERT INTO notification_envoyee (contrat_id, seuil) VALUES ($1, $2)", [contrat_id, seuil]);
};