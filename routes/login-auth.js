var express = require("express");
var selectSQL = require("../models/select-queries.js");
var router = express.Router();
var session = require("express-session");

router.get("/", function (req, res, next) {
  if (req.session.user && req.session.tempUserID) {
    res.render("login-auth", { user: req.session.user, title: "Authentication Process" });
  } else {
    res.redirect("/");
  }
});

router.post("/", async function (req, res, next) {
  const [row] = await selectSQL.getUserLogin(req.session.tempUserID);
  let errorMessage;
  let generatedCode = req.session.authCode;
  const codeInput = req.body.authCode;
  if (codeInput == generatedCode) {
    req.session.user = { userID: row[0].UserID, role: row[0].Role, loggedin: true };
    req.session.authCode = null;
    req.session.tempUserID = null;
    res.render("login-success", { user: req.session.user, title: "Successful Login" });
  } else {
    errorMessage = "This code is invalid";
    res.render("login-auth", { user: req.session.user, title: "Authentication Process", error: errorMessage });
  }
});

// ----------- Login-Success routes ---------
router.get("/login-success", async function (req, res, next) {});

module.exports = router;
