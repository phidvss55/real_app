const Joi = require('joi');

function Basket (basket) {
	this.product_id = basket.product_id;
	this.user_id = basket.user_id;
	this.qty = basket.qty;
	this.price = basket.price;
}

Basket.prototype.validateBasket = function(basket) {
	const schema = {
		product_id: Joi.number().required(),
		user_id: Joi.number().required(),
		qty: Joi.number().required(),
		price: Joi.number().required(),
	}

	return Joi.validate(basket, schema);
}

module.exports = Basket;