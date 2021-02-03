const config = require('config');
const Joi = require('joi');
const jwt = require('jsonwebtoken');

function Login(login) {
	this.username = login.username;
	this.password = login.password;
}

Login.prototype.validateLogin = function(login) {
	const schema = {
		username: Joi.string().min(5).max(200).required(),
		password: Joi.string().min(5).max(200).required(),
	}

	return Joi.validate(login, schema);
}

Login.prototype.generateAuthToken = function(login) {
	return jwt.sign({
		_id: login.id,
		_username: login.username,
	},
	config.get('jwtPrivateKey'),{
		expiresIn: config.get('expireIn')
	});

	return token;
}

module.exports = Login;