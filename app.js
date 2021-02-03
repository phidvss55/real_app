const express = require('express');
const app = express();

const database = require('./manager/database');
const variable = require('./manager/variable');
const user = require('./routes/users')
const basket = require('./routes/basket')
const product = require('./routes/product')
const order = require('./routes/order')
const category = require('./routes/category')

const con = new database({
	host: variable.HOST,
	user: variable.USER,
	password: variable.PASSWORD,
	database: variable.DATABASE,
	port: variable.PORT_DB,
});

global.db = con;

app.use(express.json())
app.use("/api/user", user);
app.use("/api/basket", basket);
app.use("/api/order", order);
app.use("/api/product", product);
app.use("/api/category", category);

app.listen(variable.PORT, () => console.log('Server is running in port ' + variable.PORT));