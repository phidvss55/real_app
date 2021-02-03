const mysql = require('mysql');

class Database {
	constructor(config) {
		// this.connection = mysql.createConnection(config);
		this.connection = mysql.createPool(config);
	}

	query(sql, args) {
		return new Promise((resolve, reject) => {
			this.connection.query(sql, args, (err, rows) => {
				if(err) return reject(err);
				return resolve(rows);
			});
		});
	}

	close() {
		return new Promise((resolve, reject) => {
			this.connection.end((err, rows) => {
				if(err) return reject(err);
				return resolve(rows);
			});
		});
	}
}

module.exports = Database;