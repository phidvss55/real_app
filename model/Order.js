const config = require('config');
const Joi = require('joi');
const jwt = require('jsonwebtoken');

function Order(body) {
	this.paymentMethod = body.paymentMethod;
	this.notes = body.notes;
	this.mobileNo = body.mobileNo;
}

Order.prototype.validateOrder = function(order) {
	const schema = {
		paymentMethod: Joi.string().min(5).max(200).required(),
		notes: Joi.optional(),
		mobileNo: Joi.optional()
	};

	return Joi.validate(order, schema);
}

module.exports = Order;