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

	insertProductInBasket(basket) {
		return db.query(
		"INSERT INTO baskets (product_id, user_id, qty, price)" +
			"VALUES(?, ?, ?, ?)", [basket.product_id, basket.user_id, basket.qty, basket.price]
		).then(rows => {
			return rows;
		});
	}
}

module.exports = AppDatabaseManager;