const modele = require("./modele_historique");

exports.getHistoriqueByContrat = async (req, res) => {
    const {id} = req.params;

    try {
        const historique = await modele.getHistoriqueByContrat(id);
        return res.json(historique);
    } catch (err) {
        console.error(err);
        return res.status(500).json({message:"Erreur récupération historique"});
    }
};
