const express = require('express');
const router = express.Router();
const auth = require('../middleware/AuthRequest');
const AppDatabaseManager = require('../manager/appDatabaseManager');

var Order = require('../model/Order');

const appDatabaseManager = new AppDatabaseManager();

router.get('/orders', auth, async (req, res) => {
	try {
		let rows = await appDatabaseManager.fetchOrders(req.user._id);
		if (rows) {
			res.status(200).send({ "success": true, "message": "Found data", "data": rows});
		}

		res.status(200).send({ "succes": false, "message": "Error occurs in excute time. " });
	} catch (err) {
		res.status(400).send({ message: err });
	}
});

router.get('/order-details/:orderId', auth, async (req, res) => {
	try {
		let result = await appDatabaseManager.fetchOrderDetails(req.params.orderId);
		if (result && result.length != 0) {
			res.status(200).send({ "success": true, "data": result });
		}
		res.status(200).send({ "success": true, "data": "empty" });
	} catch (err) {
		res.status(400).send({ message: err });
	}
});

router.post('/orders', auth, async (req, res) => {
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
