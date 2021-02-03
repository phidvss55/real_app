const express = require('express');
const router = express.Router();
const auth = require('../middleware/AuthRequest');
const AppDatabaseManager = require('../manager/appDatabaseManager');

var Order = require('../model/Order');

const appDatabaseManager = new AppDatabaseManager();

router.get('/', auth, async (req, res) => {
	try {
		res.status(200).send(await appDatabaseManager.fetchOrders(req.user._id));
	} catch (err) {
		res.status(400).send({ message: err });
	}
});

router.get('/order-details/:orderId', auth, async (req, res) => {
	try {
		res.status(200).send(await appDatabaseManager.fetchOrderDetails(req.params.orderId));
	} catch (err) {
		res.status(400).send({ message: err });
	}
});

router.post('/', auth, async (req, res) => {
	try {
		let order = new Order(req.body);
		let transactionId = "Card";

		const { error } = order.validateOrder(order);
		if (!error) {
			return res.status(401).send({ message: error.details[0].message });
		}

		order.user_id = req.user._id;
		if (order.paymentMethod == "Card") {

		}

		order.transactionId = transactionId;
		let orderId = await appDatabaseManager.saveOrder(order);
		order.id = orderId;
		await appDatabaseManager.saveOrderDetails(order);

		res.status(200).send({ order_id: orderId, transaction_id: transactionId});
	} catch (error) {
		res.status(400).send({message: error });
	}
});

module.exports = router;
