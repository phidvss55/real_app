const express = require('express');
const app = express();
const path = require('path');

app.set('view engine', 'jade');
app.set('views', path.join(__dirname, 'views'));

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
const prefix = variable.PREFIX;

global.db = con;

app.get('/', function (req, res) {
    res.render('index');
});

app.use(express.json())
app.use(prefix, user);
app.use(prefix, basket);
app.use(prefix, order);

app.use(prefix, product);

app.use("/api/category", category);

app.listen(variable.PORT, () => console.log('Server is running in port ' + variable.PORT));