const express = require('express');
const router = express.Router();
const auth = require('../middleware/AuthRequest');

var Basket = require('../model/Basket');

const AppDatabaseManager = require('../manager/appDatabaseManager');
const appDatabaseManager = new AppDatabaseManager();

router.get('/basket', auth, async(req, res) => {
	try {
		res.status(200).send(await appDatabaseManager.fetchBasket(req.user._id));
	} catch (error) {
		res.status(400).json(error);
	}
})

router.get('/get-basket-count', auth, async(req, res) => {
	try {
		res.status(200).send({ "success": true, "data": await appDatabaseManager.fetchBasketCount(req.user._id) })
	} catch(error) {
		res.status(400).send(error);
	}
})

router.post('/basket', auth, async (req, res) => {
	try {
		var basket = new Basket(req.body);
		basket.user_id = req.user._id;
		const { error } = basket.validateBasket(basket);
		if (error) return res.status(400).send({ message: error.details[0].message });

		let result = await appDatabaseManager.insertProductInBasket(basket);
		if (result) {
			if (result.changedRows == 1) {
				res.status(200).send({ "success": true, "message": "Updated success" });
			} else {
				res.status(200).send({ "success": true, "message": "Insert success" });
			}
			// res.status(200).send(result);
		}
		throw new Error("Insert not success");
	} catch(error) {
		res.status(400).send(error);
	}
})

router.put('/basket', auth, async (req, res) => {
    try {
        var basket = new Basket(req.body);
	    basket.user_id = req.user._id;

	    const { error } = basket.validateBasket(basket);
        if(error) return res.status(400).send({ message: error.details[0].message });

        res.status(200).send(await appDatabaseManager.updateProductBasket(basket));
    } catch(err) {
        res.status(400).send(err);
    }
})

router.delete('/basket/:id', auth, async (req, res) => {
	try {
		if (!req.params.id) return res.status(400).send({ message: "Basket id is invalid"})
		let result = appDatabaseManager.deleteProductFromBasket(req.params.id, req.user._id);
		if (result) {
			res.status(200).send({ "success": true, "message": "Delete success" });
		}

		res.status(200).send({ "success": false, "message": "Delete fail" });
	} catch(error) {
		res.status(400).send(error);
	}
})

module.exports = router;