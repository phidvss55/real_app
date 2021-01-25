const express = require('express');
const app = express();

const user = require('./routes/user')
const database = require('./manager/database');
const variable = require('./manager/variable');

const con = new database({
	host: variable.HOST,
	user: variable.USER,
	password: variable.PASSWORD,
	database: variable.DATABASE,
	port: variable.PORT_DB,
});

global.db = con;

app.use(express.json())
app.use("/api/user", user)

app.listen(variable.PORT, () => console.log('Server is running in port ' + variable.PORT));