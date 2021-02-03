class AppDatabaseManager {
	//#region Users
	fetchUserByEmail(email) {
		return db.query("SELECT * FROM users WHERE email = ?", email).then(rows => {
			return rows
		});
	}

	fetchUserByUsername(username) {
		return db.query("SELECT * FROM users WHERE username = ?", username).then(rows => {
			return rows
		});
	}

	doRegister(register) {
		return db.query("INSERT INTO users (username, email, password, phone, fullname) VALUES (?, ?, ?, ?, ?)", [
			register.username,
			register.email,
			register.password,
			register.phone,
			register.fullname,
		]);
	}
	//#endregion Users

	//#region Basket
	fetchBasket(userId) {
		return db.query(
		"SELECT b.id, b.product_id, b.price, b.qty, p.image " +
			"FROM baskets b " +
			"INNER JOIN products p " +
			"ON b.product_id = p.id " +
			"WHERE b.user_id = ?", [userId]
		).then(rows => {
			return rows;
		});
	}

	fetchBasketCount(userId) {
		return db.query(
		"SELECT sum(qty) as BasketCount " +
			"FROM baskets " +
			"WHERE user_id = ?", [userId]
		).then(rows => {
			return rows
		});
	}

	fetchProductFromBasket(product_id, user_id) {
		let sql = "SELECT * FROM baskets WHERE product_id = ? AND user_id = ?";
		return db.query(sql, [product_id, user_id]).then(rows => {
			return rows
		});
	}

	async insertProductInBasket(basket) {
		const productInBasket = await this.fetchProductFromBasket(basket.product_id, basket.user_id);

		if (productInBasket && productInBasket.length != 0) {
			let basketId = productInBasket[0].id;
			let qty = productInBasket[0].qty + basket.qty;
			let price = productInBasket[0].price + basket.price;

			return db.query(
			"UPDATE baskets " +
				"SET qty = ?, price = ? " +
				"WHERE id = ?", [qty, price, basketId]
			).then(rows => { return rows });
		} else {
			return db.query(
				"INSERT INTO baskets (product_id, user_id, qty, price)" +
				"VALUES(?, ?, ?, ?)", [basket.product_id, basket.user_id, basket.qty, basket.price]
			).then(rows => {
				return rows;
			});
		}
	}

	updateProductBasket(basket) {
		return db.query(
			"UPDATE baskets SET qty = ?, price = ? WHERE product_id = ? AND user_id = ?",
			[basket.qty, basket.price, basket.product_id, basket.user_id]
		).then(rows => { return rows })
	}

	deleteProductFromBasket(basketId, userId) {
		return db.query(
		"DELETE FROM baskets WHERE user_id = ? AND id = ?", [userId, basketId]
		).then(rows => { return rows });
	}
	//#endregion Basket

	//#region Order
	fetchOrders(userId) {
		return db.query(
		"SELECT * FROM orders WHERE id = ?", [userId]
		).then(rows => {
			return rows;
		});
	}

	fetchOrderDetails(orderId) {
		return db.query(
			"SELECT * FROM order_details WHERE order_id = ?",
			[orderId]
		).then(rows => { return rows });
	}

	saveOrder(order) {
		let today = new Date();
		return db.query(
			"INSERT INTO orders (order_date, user_id, is_paid, is_printed) VALUES (?, ?, ?, ?)",
			[today, order.user_id, true, false]
		).then(rows => { return rows.insertId });
	}

	saveOrderDetails(order) {
		let sql = "INSERT INTO order_details (order_id, product_id, qty, price) " +
		"SELECT ?, product_id, qty, price FROM baskets WHERE user_id = ?";

		return db.query(sql, [order.id, order.user_id]).then(rows => { return rows });
	}
	//#endregion Order

	//#region Category + Product
	fetchCategories() {
		return db.query(
			"SELECT * FROM categories"
		).then(rows => { return rows });
	}

	fetchProducts(catId, userId) {
		let sql =
			"SELECT p.id, name, description, price, image," +
			"CASE WHEN EXISTS (" +
				"SELECT id " +
				"FROM favourite f " +
				"WHERE f.product_id = p.id AND f.user_id = ?) " +
			"THEN true ELSE FALSE END AS isFavoured " +
			"FROM products p " +
			"INNER JOIN product_category pc ON p.id = pc.product_id " +
			"WHERE pc.category_id = ?";
		return db.query(sql, [userId, catId]).then(rows => {
			return rows;
		});
	}
	//#endregion
}

module.exports = AppDatabaseManager;