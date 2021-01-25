const express = require('express');
const jwt = require('jsonwebtoken');
const variable = require('../manager/variable');

const app = express();

app.post(`${variable.PREFIX}/posts`, verifyToken, (req, res) => {
	jwt.verify(req.token, 'secretkey', (err, authData) => {
		if (err) {
			res.sendStatus(403);
		} else {
			res.json({
				message: 'Post is created',
				authData
			});
		}
	})
});

app.post('/api/login', (req, res) => {
	const user = {
		id: 1,
		username: 'brad',
		email: "brad@gmail.com"
	}

	jwt.sign({user}, 'secretkey', {expiresIn: '30s'}, (err, token) => {
		res.json({
			token
		});
	});
});

// FORMAT token
function verifyToken(req, res, next) {
	//get auth header value
	const bearerHeader = req.headers['authorization'];
	// Check if beaer undifine
	if (typeof bearerHeader != 'undefined') {
		// split the space
		const bearer = bearerHeader.split(' ');
		req.token = bearer[1];

		next();
	} else {
		res.sendStatus(403)
	}
}