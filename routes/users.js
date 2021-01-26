const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const AppDatabaseManager = require('../manager/appDatabaseManager');
const appDatabaseManager = new AppDatabaseManager();

var Register = require('../model/Register');
var Login = require('../model/Login');

router.post('/register', async (req, res) => {
	try {
		var register = new Register(req.body);
		const { error } = register.validateRegister(register)
		if (error) return res.status(400).send({message: error.details[0].message})

		let userCheck = await appDatabaseManager.fetchUserByEmail(register.email);
		if (userCheck.length != 0) return res.status(400).send('User already registerd');

		const salt = await bcrypt.genSalt(10);
		register.password = await bcrypt.hash(register.password, salt);
		console.log(register)
		let user = await appDatabaseManager.doRegister(register);

		res.status(200).json(user);
	} catch(error) {
		res.status(400).send(error);
	}
})

router.post('/login', async (req, res) => {
	try {
		var login = new Login(req.body);
		const { error } = login.validateLogin(login);
		if (error) return res.status(400).send({ message: error.details[0].message })

		const userInfo = await appDatabaseManager.fetchUserByUsername(login.username);
		if(userInfo.length == 0)
			return res.status(400).send("Invalid username or password");

		const validPassword = bcrypt.compare(login.password, userInfo[0].password);
		if (!validPassword)
			return res.status(400).send('Invalid username or password');

		res.status(400).send({

			token: await login.generateAuthToken(login)
		});
	} catch(error) {
		return res.status(400).json(error);
	}
})

module.exports = router;
