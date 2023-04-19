var express = require("express");
var utilities = require("../models/utilities.js");
var selectSQL = require("../models/select-queries.js");
var router = express.Router();
var session = require("express-session");

// ----------- Login routes ---------
router.get("/", async function (req, res, next) {
  res.render("login", { user: req.session.user, title: "Login", usernameError: null, passwordError: null });
});

router.post("/", async function (req, res, next) {
  //Password hashing
  let errorMessage;
  const [row] = await selectSQL.getUserLogin(req.body.username);

  // If no user is found
  if (row.length === 0) {
    errorMessage = "User not found";
    res.render("login", { user: req.session.user, title: "Login", usernameError: errorMessage, passwordError: null });
    return;
  }

  const hashedPassword = row[0].Password;
  const status = row[0].Status;
  if (status == "Suspended") {
    errorMessage = "Your account has been suspended";
    res.render("login", { user: req.session.user, title: "Login", usernameError: errorMessage, passwordError: null });
    return;
  }

  const result = await utilities.comparePasswords(req.body.password, hashedPassword);
  if (result) {
    const code = await utilities.generateCode();
    console.log(row[0].Email);
    await utilities.emailUser(code, row[0].Email);
    req.session.authCode = code;
    req.session.tempUserID = row[0].UserID;

    res.render("login-auth", { user: req.session.user, title: "Authentication Process", error: null });
  } else {
    errorMessage = "Password does not match";
    res.render("login", { user: req.session.user, title: "Login", usernameError: null, passwordError: errorMessage });
  }
});

module.exports = router;
