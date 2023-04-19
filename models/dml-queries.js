var db = require("./sqlserver.js");
//----------------USER DETAIL QUERIES-----------------------
async function registerUser({ firstname, lastname, username, email, dateofbirth }, hashedPassword, role) {
  let isCreated = false;
  const connection = await db.connectToDB();
  const defaultImage = "/images/profile-pictures/Default_Profile_Picture.png";
  const defaultAboutMe =
    "Welcome to your profile, Here you can write a section about yourself, your hobbies & your longterm goals.";
  const status = "Active";

  //Inserting new user

  const sql = `INSERT INTO horizons.users(UserID,Firstname,Lastname,Email,Password,DoB,
      Role,Status,PicturePath,AboutMe)VALUES(?,?,?,?,?,?,?,?,?,?)`;
  const values = [
    username,
    firstname,
    lastname,
    email,
    hashedPassword,
    dateofbirth,
    role,
    status,
    defaultImage,
    defaultAboutMe,
  ];
  await connection
    .execute(sql, values)
    .then((result) => {
      console.log(result);
      db.closeDB(connection);
      return (isCreated = true);
    })
    .catch((error) => console.error(error.message));
  db.closeDB(connection);
  console.log(isCreated);
  return isCreated;
}

async function editUserAboutMe(aboutMe, username) {
  let success = false;
  const connection = await db.connectToDB();

  const sql = `UPDATE horizons.users SET AboutME = ? WHERE UserID = ?`;
  const values = [aboutMe, username];
  await connection
    .execute(sql, values)
    .then((result) => {
      console.log(result);
      db.closeDB(connection);
      return (success = true);
    })
    .catch((error) => console.error(error.message));
  db.closeDB(connection);
  console.log(success);
  return success;
}

async function editUserPicturePath(newPath, username) {
  let success = false;
  const connection = await db.connectToDB();

  const sql = `UPDATE horizons.users SET PicturePath = ? WHERE UserID = ?`;
  const values = [newPath, username];
  await connection
    .execute(sql, values)
    .then((result) => {
      console.log(result);
      db.closeDB(connection);
      return (success = true);
    })
    .catch((error) => console.error(error.message));
  db.closeDB(connection);
  console.log(success);
  return success;
}

async function updateUser(firstname, lastname, DoB, role, status, oldUsername, newUsername) {
  let success = false;
  const connection = await db.connectToDB();

  const sql = `UPDATE horizons.users SET UserID = ?, Firstname = ?,Lastname = ?,DoB = ?,Role = ?,Status = ? WHERE UserID = ?`;
  const values = [newUsername, firstname, lastname, DoB, role, status, oldUsername];
  await connection
    .execute(sql, values)
    .then((result) => {
      console.log(result);
      db.closeDB(connection);
      return (success = true);
    })
    .catch((error) => console.error(error.message));
  db.closeDB(connection);
  console.log(success);
  return success;
}

async function deleteUser(username) {
  let success = false;
  const connection = await db.connectToDB();

  const sql = `DELETE FROM horizons.users WHERE UserID = ?`;
  const values = [username];
  await connection
    .execute(sql, values)
    .then((result) => {
      console.log(result);
      db.closeDB(connection);
      return (success = true);
    })
    .catch((error) => console.error(error.message));
  db.closeDB(connection);
  console.log(success);
  return success;
}

//----------------TASK & TASKLIST QUERIES-----------------------
async function createNewTask(taskName, taskDesc, taskDeadline, tasklistID) {
  let success = false;
  const timeCreated = new Date();
  const connection = await db.connectToDB();

  const sql = `INSERT INTO horizons.tasks(TaskName,TaskDescription,TaskDeadline,TasklistID,Complete,TimeCreated
    )VALUES(?,?,?,?,?,?)`;
  const values = [taskName, taskDesc, taskDeadline, tasklistID, 0, timeCreated];
  await connection
    .execute(sql, values)
    .then((result) => {
      db.closeDB(connection);
      return (success = true);
    })
    .catch((error) => console.error(error.message));
  db.closeDB(connection);
  console.log(success);
  return success;
}

async function createNewTasklist(taskListname, userID) {
  let success = false;
  const timeCreated = new Date();
  const connection = await db.connectToDB();
  const sql = `INSERT INTO horizons.tasklists(TasklistName,UserID,Complete,TimeCreated)VALUES(?,?,?,?)`;
  const values = [taskListname, userID, 0, timeCreated];
  await connection
    .execute(sql, values)
    .then((result) => {
      db.closeDB(connection);
      return (success = true);
    })
    .catch((error) => console.error(error.message));
  db.closeDB(connection);
  console.log(success);
  return success;
}

async function editTasklist(taskListname, tasklistID) {
  let success = false;
  const connection = await db.connectToDB();
  const sql = `UPDATE horizons.tasklists SET TasklistName = ? WHERE TasklistID = ?`;
  const values = [taskListname, tasklistID];
  await connection
    .execute(sql, values)
    .then((result) => {
      db.closeDB(connection);
      return (success = true);
    })
    .catch((error) => console.error(error.message));
  db.closeDB(connection);
  return success;
}

async function deleteTasklist(tasklistID) {
  let success = false;
  const connection = await db.connectToDB();
  const sql = `DELETE FROM horizons.tasklists WHERE TasklistID = ?`;
  const values = [tasklistID];
  await connection
    .execute(sql, values)
    .then((result) => {
      db.closeDB(connection);
      return (success = true);
    })
    .catch((error) => console.error(error.message));
  db.closeDB(connection);
  return success;
}

async function completeTask(tasklistID, taskID) {
  let success = false;
  const connection = await db.connectToDB();

  const sql = "UPDATE tasks SET Complete = 1 WHERE TasklistID = ? AND TaskID = ?";
  const values = [tasklistID, taskID];
  await connection
    .execute(sql, values)
    .then((result) => {
      console.log(result);
      db.closeDB(connection);
      return (success = true);
    })
    .catch((error) => console.error(error.message));
  db.closeDB(connection);
  console.log(success);
  return success;
}

async function checkTaskListCompletion(tasklistID, countOfTasks) {
  const connection = await db.connectToDB();
  const sql = `SELECT COUNT(Complete) AS completedTasks FROM horizons.tasks WHERE TasklistID = ? AND Complete = 1`;
  const values = [tasklistID];
  const countResult = await connection.execute(sql, values);
  const completedTasks = parseInt(countResult[0][0].completedTasks);
  if (completedTasks == countOfTasks) {
    const sql = `UPDATE horizons.tasklists SET Complete = 1  WHERE TasklistID = ?`;
    const values = [tasklistID];
    await connection.execute(sql, values);
  } else {
    const sql = `UPDATE horizons.tasklists SET Complete = 0  WHERE TasklistID = ?`;
    const values = [tasklistID];
    await connection.execute(sql, values);
  }
}

module.exports = {
  registerUser,
  updateUser,
  deleteUser,
  editUserAboutMe,
  editUserPicturePath,
  createNewTask,
  createNewTasklist,
  editTasklist,
  deleteTasklist,
  completeTask,
  checkTaskListCompletion,
};
