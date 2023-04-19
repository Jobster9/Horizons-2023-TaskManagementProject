var express = require("express");
var router = express.Router();
var selectSQL = require("../models/select-queries.js");
var dmlSQL = require("../models/dml-queries.js");
const utilities = require("../models/utilities.js");

router.get("/", async function (req, res, next) {
  if (!req.session.user) {
    res.render("login", { user: req.session.user, title: "Login", usernameError: null, passwordError: null });
  } else {
    renderViewUsers(req, res);
  }
});

async function renderViewUsers(req, res, displayMsg = null) {
  let page = typeof req.query.page !== "undefined" ? parseInt(req.query.page) : 1;
  const rowsPerPage = 8;
  const offset = (page - 1) * rowsPerPage;
  const [rows] = await selectSQL.getUsers(offset, rowsPerPage);
  const [numOfRowsArray] = await selectSQL.countUsers();
  const numOfRows = Object.values(numOfRowsArray[0]);
  const totalPages = Math.ceil(numOfRows / rowsPerPage);
  const viewUsers = [];
  for (let user of rows) {
    const DoB = await utilities.reformatDate(user.DoB);
    viewUsers.push({
      UserID: user.UserID,
      Firstname: user.Firstname,
      Lastname: user.Lastname,
      DoB: DoB,
      Role: user.Role,
      Status: user.Status,
    });
  }
  res.render("view-users", {
    user: req.session.user,
    viewUsers: viewUsers,
    page: page,
    totalPages: totalPages,
    title: "View Users",
    alert: displayMsg,
  });
}

router.post("/", async function (req, res, next) {
  let username, firstname, lastname, DoB, role, status;

  if (req.body.submitUpdateUser) {
    oldUsername = req.body.oldUsername;
    newUsername = req.body.newUsername;
    firstname = req.body.firstname;
    lastname = req.body.lastname;
    DoB = req.body.DoB;
    role = req.body.role;
    status = req.body.status;

    result = await dmlSQL.updateUser(firstname, lastname, DoB, role, status, oldUsername, newUsername);
    if (result == false) {
      renderViewUsers(req, res, "User changes failed. Duplicate Username.");
    }
    renderViewUsers(req, res, "User changes updated.");
  }
  if (req.body.submitDeleteUser) {
    username = req.body.deleteUsername;
    status = req.body.deleteUserStatus;
    if (status !== "Active") {
      await dmlSQL.deleteUser(username);
      renderViewUsers(req, res, "User has been deleted.");
    }
  }
});

module.exports = router;
