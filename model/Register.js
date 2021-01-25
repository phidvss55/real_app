const Joi = require('joi');

function Register(body) {
	this.username = body.username
	this.email = body.email
	this.password = body.password
	this.phone = body.phone
	this.fullname = body.fullname
}

Register.prototype.validateRegister = function(register) {
	const schema = {
		username: Joi.string().min(4).max(200).required(),
		password: Joi.string().min(5).max(200).required(),
		email: Joi.string().min(5).max(200).required().email(),
		fullname: Joi.string().min(5).max(200).required(),
		phone: Joi.string().min(5).max(200).required()
	};

	return Joi.validate(register, schema)
}

module.exports = Register;
