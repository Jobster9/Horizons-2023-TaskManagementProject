const mysql2 = require("mysql2/promise");

//-------Database Connection-----------

async function connectToDB() {
  const connection = mysql2.createConnection({
    host: "localhost",
    user: "root",
    password: "rootuser",
    database: "horizons",
  });
  return await connection;
}

function closeDB(connection) {
  connection.end((error) => {
    if (error) {
      console.log("Error closing the connection " + error.message);
      return;
    }
  });
}

module.exports = { connectToDB, closeDB };
