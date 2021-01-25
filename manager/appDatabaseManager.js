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
}

module.exports = AppDatabaseManager;