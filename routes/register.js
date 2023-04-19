var express = require("express");
var router = express.Router();
var utilities = require("../models/utilities.js");
var dmlSQL = require("../models/dml-queries.js");

router.get("/", async function (req, res, next) {
  res.render("register", { user: req.session.user, title: "Register", error: null });
});

router.post("/", async function (req, res, next) {
  //Password hashing
  const hashedPassword = await utilities.encryptPassword(req.body.password);
  const role = "Customer";
  let success = await dmlSQL.registerUser(req.body, hashedPassword, role);
  if (success) {
    res.render("register-success", { user: req.session.user, title: "Successfully Registered" });
  } else {
    let errorMessage = "There was an error creating your account, please try again";
    res.render("register", { user: req.session.user, title: "Register", error: errorMessage });
  }
});

module.exports = router;
