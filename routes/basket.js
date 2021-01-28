const express = require('express');
const router = express.Router();
const auth = require('../middleware/AuthRequest');

var Basket = require('../model/Basket');

const AppDatabaseManager = require('../manager/appDatabaseManager');
const appDatabaseManager = new AppDatabaseManager();

router.get('/', auth, async(req, res) => {
	try {
		res.status(200).send(await appDatabaseManager.fetchBasket(req.user._id));
	} catch (error) {
		res.status(400).json(error);
	}
})

router.get('/get-basket-count', auth, async(req, res) => {
	try {
		res.status(200).send(await appDatabaseManager.fetchBasketCount(req.user._id))
	} catch(error) {
		res.status(400).send(error);
	}
})

router.post('/basket', auth, async (req, res) => {
	try {
		var basket = new Basket(req.body);
		const { error } = basket.validateBasket(basket);
		if (error) return res.status(400).send({ message: error.details[0].message });

		basket.user_id = req.user._id;
		res.status(200).send(await appDatabaseManager.insertProductInBasket(req.user._id));
	} catch(error) {
		res.status(400).send(error);
	}
})

router.put('/', auth, async (req, res) => {
    try {
        var basket = new Basket(req.body);
        const { error } = basket.validateBasket(basket);    
        if(error) return res.status(400).send({ message: error.details[0].message });

        basket.user_id = req.user._id;
        res.status(200).send(await appDatabaseManager.updateProductBasket(basket));
    } catch(err) {
        res.status(400).send(err);
    }
})

router.delete('/:id', auth, async (req, res) => {
	try {
		if (!req.params.id) return res.status(400).send({ message: "Basket id is invalid"})

		res.status(200).send(appDatabaseManager.deleteProductFromBasket(req.params.id, req.user._id));
	} catch(error) {
		res.status(400).send(error);
	}
})
