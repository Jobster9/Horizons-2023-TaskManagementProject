//---- dependencies ----
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var livereload = require("livereload");
var connectLiveReload = require("connect-livereload");
var session = require("express-session");

//---- routes requires ----
var indexRouter = require("./routes/index");
var registerRouter = require("./routes/register");
var loginRouter = require("./routes/login");
var loginAuthRouter = require("./routes/login-auth");
var viewUsersRouter = require("./routes/view-users");
var createAdminRouter = require("./routes/create-admin");
var profileRouter = require("./routes/profile");
var editTaskRouter = require("./routes/tasklists");

var app = express();
const liveReloadServer = livereload.createServer();
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});

app.use(connectLiveReload());

//---- view engine setup ----
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "public")));

// cookie session
app.use(
  session({
    name: "sid",
    resave: false,
    saveUninitialized: false,
    secret: "test secret",
    cookie: {
      maxAge: 1000 * 60 * 60 /*one hour*/,
      sameSite: true,
    },
  })
);

app.use(cookieParser("test secret"));

app.use((req, res, next) => {
  if (!req.session.user && req.signedCookies.user) {
    req.session.user = JSON.parse(req.signedCookies.user);
    // Delete the signed cookie to avoid conflicts
    res.clearCookie("user");
  }
  next();
});

// ---- router uses ----
app.use("/", indexRouter);
app.use("/register", registerRouter);
app.use("/login", loginRouter);
app.use("/login-auth", loginAuthRouter);
app.use("/view-users", viewUsersRouter);
app.use("/create-admin", createAdminRouter);
app.use("/profile", profileRouter);
app.use("/tasklists", editTaskRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
