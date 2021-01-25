const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const AppDatabaseManager = require('../manager/appDatabaseManager');
const appDatabaseManager = new AppDatabaseManager();

var Register = require('../model/Register');

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

		console.log(user.id);
		console.log(user);

		res.status(200).json(user);
	} catch(error) {
		res.status(400).send(error);
	}
})

module.exports = router;