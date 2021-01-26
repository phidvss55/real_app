class AppDatabaseManager {
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

	fetchBasket(userId) {
		return db.query(
		"SELECT b.id, b.product_id, b.price, b.qty, p.image " +
			"FROM baskets b" +
			"INNER JOIN products p" +
			"ON b.product_id = p.id" +
			"WHERE b.user_id = ?", [userId]
		).then(rows => {
			return rows;
		});
	}

	fetchBasketCount(userId) {
		return db.query(
		"SELECT sum(qty) as BasketCount" +
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

		if (productInBasket) {
			let qty = productInBasket[0].qty + basket.qty;
			let price = productInBasket[0].price + basket.price;

			return db.query(
			"UPDATE baskets " +
				"SET qty = ?, price = ? " +
				"WHERE id = ?", [qty, price, productInBasket[0].id]
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

	updateProductBasket(basketId) {
		return db.query(
			"UPDATE baskets SET qty = ?, price = ? WHERE id = ? AND user_id = ?",
			[basket.qty, basket.price, basket.id, basket.user_id]
		).then(rows => { return rows })
	}

	deleteProductFromBasket(basketId, userId) {
		return db.query(
		"DELETE FROM baskets WHERE user_id = ? AND id = ?", [userId, basketId]
		).then(rows => { return rows });
	}
}

module.exports = AppDatabaseManager;