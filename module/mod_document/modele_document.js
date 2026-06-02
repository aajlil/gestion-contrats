const pool = require("../../db");

exports.ajouterDocument = async (nom_fichier, chemin, type, contrat_id) => {
    await pool.query(
        "INSERT INTO document (nom_fichier, chemin, type, contrat_id) VALUES ($1, $2, $3, $4)", [nom_fichier, chemin, type, contrat_id]
    );
};


exports.getDocumentsByContrat = async (contrat_id) => {
    const result = await pool.query(
        "SELECT * FROM document WHERE contrat_id = $1 ORDER BY uploader_a DESC", [contrat_id]
    );
    return result.rows;
};


exports.getDocumentById = async (id) => {
    const result = await pool.query(
        "SELECT * FROM document WHERE id_document = $1", [id]);
    return result.rows[0];
};


exports.supprimerDocument = async (id) => {
    await pool.query(
        "DELETE FROM document WHERE id_document = $1", [id]);
};


exports.getDocumentsUtilisateur = async (utilisateur_id) => {
    const result = await pool.query(`
        SELECT
            d.id_document, d.nom_fichier, d.chemin, d.type, d.uploader_a, d.contrat_id, c.nom AS contrat_nom
        FROM document d
        LEFT JOIN contrat c ON d.contrat_id = c.id_contrat
        WHERE c.responsable_id = $1
        ORDER BY d.uploader_a DESC`, [utilisateur_id]);
    return result.rows;
};


exports.getDocumentUtilisateurById = async (id_document, utilisateur_id) => {
    const result = await pool.query(`
        SELECT
            d.id_document, d.nom_fichier, d.chemin, d.type, d.uploader_a, d.contrat_id
        FROM document d
        LEFT JOIN contrat c ON d.contrat_id = c.id_contrat
        WHERE d.id_document = $1 AND c.responsable_id = $2`, [id_document, utilisateur_id]);
    return result.rows[0];
};
