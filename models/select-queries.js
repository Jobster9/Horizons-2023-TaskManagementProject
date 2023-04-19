var db = require("./sqlserver.js");

async function getUserLogin(username) {
  //verifying user
  const connection = await db.connectToDB();
  const sql = `SELECT UserID,Password,Email,Role,Status FROM horizons.users WHERE UserID = ?`;
  const values = [username];
  try {
    return await connection.execute(sql, values);
  } catch {
    (error) => console.error(error.message);
  }
}

//--------View Users Page-----------

async function countUsers() {
  const connection = await db.connectToDB();
  try {
    return await connection.execute(`SELECT COUNT(UserID) FROM horizons.users`);
  } catch {
    (error) => console.error(error.message);
  }
}

async function getUsers(offset, rowsPerPage) {
  const connection = await db.connectToDB();
  try {
    return await connection.execute(
      `SELECT UserID,Firstname,Lastname,DoB,Role,Status FROM horizons.users LIMIT ${offset}, ${rowsPerPage}`
    );
  } catch {
    (error) => console.error(error.message);
  }
}

async function getUserAboutMe(username) {
  const connection = await db.connectToDB();
  const sql = `SELECT AboutMe FROM horizons.users WHERE UserID = ?`;
  const values = [username];
  try {
    return await connection.execute(sql, values);
  } catch {
    (error) => console.error(error.message);
  }
}

async function getUserPicturePath(username) {
  const connection = await db.connectToDB();
  const sql = `SELECT PicturePath FROM horizons.users WHERE UserID = ?`;
  const values = [username];
  try {
    return await connection.execute(sql, values);
  } catch {
    (error) => console.error(error.message);
  }
}

async function getUserTaskLists(username) {
  const connection = await db.connectToDB();
  const sql = `SELECT * FROM horizons.tasklists WHERE UserID = ?`;
  const values = [username];
  try {
    return await connection.execute(sql, values);
  } catch {
    (error) => console.error(error.message);
  }
}

async function getUserTasks(tasklist) {
  const connection = await db.connectToDB();
  const sql = `SELECT * FROM horizons.tasks WHERE TasklistID = ?`;
  const values = [tasklist];
  try {
    return await connection.execute(sql, values);
  } catch {
    (error) => console.error(error.message);
  }
}

module.exports = {
  getUserLogin,
  getUserAboutMe,
  getUserPicturePath,
  countUsers,
  getUsers,
  getUserTaskLists,
  getUserTasks,
};
