const express = require('express');
const router = express.Router();

var Basket = require('../model/Basket');

const AppDatabaseManager = require('../manager/appDatabaseManager');
const appDatabaseManager = new AppDatabaseManager();

router.get('/', async(req, res) => {
	try {
		res.status(200).send(await appDatabaseManager.fetchBasket(req.user._id));
	} catch (error) {
		res.status(400).json(error);
	}
})

router.get('/get-basket-count', async(req, res) => {
	try {
		res.status(200).send(await appDatabaseManager.fetchBasketCount(req.user._id))
	} catch(error) {
		res.status(400).send(error);
	}
})

router.post('/basket', async (req, res) => {
	try {
		var basket = new Basket(req.body);
		const { error } = basket.validateBasket(basket);
		if (error) return res.status(400).send({ message: error.details[0].message });

		basket.user_id = req.user._id;
		res.status(200).send(await appDatabaseManager.insertProductInBasket(req.user._id));
	} catch(error) {
		req.status(400).send(error);
	}
})

router.delete('/:id', (req, res) => {
	try {
		if (!req.params.id) return res.status(400).send({ message: "Basket id is invalid"})

		res.status(200).send(appDatabaseManager.deleteProductFromBasket(req.params.id, req.user._id));
	} catch(error) {
		req.status(400).send(error);
	}
})
