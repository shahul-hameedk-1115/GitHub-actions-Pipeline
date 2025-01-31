const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "mysql-db",
  user: "root",
  password: "password",
  database: "mydb",
});

connection.connect((err) => {
  if (err) {
    console.error("Database connection failed: " + err.stack);
    return;
  }
  console.log("Connected to MySQL.");
  connection.query("SELECT * FROM users", (error, results) => {
    if (error) throw error;
    console.log("Users:", results);
  });
});

