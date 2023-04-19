var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", async function (req, res, next) {
  const homeImage = "/images/dawid-zawila--G3rw6Y02D0-unsplash-Medium.jpg";
  res.render("index", { Image: homeImage, user: req.session.user, title: "Horizons Homepage" });
});

router.get("/terms-conditions", async function (req, res, next) {
  res.render("terms-conditions", { user: req.session.user, title: "Terms & Conditions" });
});

router.post("/", async function (req, res) {
  if (req.session) {
    req.session.destroy();
    res.redirect("/");
  }
});

module.exports = router;
