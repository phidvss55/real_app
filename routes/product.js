const express = require('express');
const auth = require('../middleware/AuthRequest');
const router = express.Router();
const AppDatabaseManager = require('../manager/appDatabaseManager');
const appDatabaseManager = new AppDatabaseManager();

router.get('/products', auth, async (req, res) => {
	try {
		if (!req.params.category_id) {
			res.status(404).send('Category ID is invalid');
		}
		res.status(200).send(await appDatabaseManager.fetchProducts(req.params.catId, req.user._id));
	} catch (err) {
		res.status(400).send({ message: err });
	}
});

module.exports = router;
