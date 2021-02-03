const express = require('express');
const auth = require('../middleware/AuthRequest');
const AppDatabaseManager = require('../manager/appDatabaseManager');
const appDatabaseManager = new AppDatabaseManager();
const router = express.Router();

router.get('/', auth, async (req, res) => {
	try {
		res.status(200).send(await appDatabaseManager.fetchCategories());
	} catch (err) {
		res.status(400).send({ message: err });
	}
});

module.exports = router;