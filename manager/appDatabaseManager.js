class AppDatabaseManager {
	fetchUserByEmail(username) {
		return db.query("SELECT * FROM users WHERE username = ?", username).then(rows => {
			return rows
		});
	}

	doRegister(register) {
		return db.query("INSERN INTO users (username, email, password) VALUES (?, ?, ?)", [
			register.username,
			register.email,
			register.password
		]);
	}
}

module.exports = AppDatabaseManager;