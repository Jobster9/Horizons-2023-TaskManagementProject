var express = require("express");
var router = express.Router();
var utilities = require("../models/utilities.js");
var dmlSQL = require("../models/dml-queries.js");

router.get("/", async function (req, res, next) {
  res.render("create-admin", { user: req.session.user, title: "Create Admin", error: null });
});

router.post("/", async function (req, res, next) {
  //Password hashing
  const hashedPassword = await utilities.encryptPassword(req.body.password);
  const role = "Admin";
  let success = await dmlSQL.registerUser(req.body, hashedPassword, role);
  if (success) {
    res.render("create-admin-success", { user: req.session.user, title: "Successfully Created" });
  } else {
    let errorMessage = "There was an error creating your account, please try again";
    res.render("create-admin", { user: req.session.user, title: "Create Admin", error: errorMessage });
  }
});

module.exports = router;
