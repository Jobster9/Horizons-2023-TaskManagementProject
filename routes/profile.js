var express = require("express");
const multer = require("multer");
var selectSQL = require("../models/select-queries.js");
var dmlSQL = require("../models/dml-queries.js");
const path = require("path");
const fs = require("fs").promises;
var router = express.Router();
const utilities = require("../models/utilities.js");

router.get("/", async function (req, res, next) {
  if (!req.session.user) {
    res.render("login", { user: req.session.user, title: "Login", usernameError: null, passwordError: null });
  } else {
    renderProfile(req, res);
  }
});

async function renderProfile(req, res) {
  const [pathResult] = await selectSQL.getUserPicturePath(req.session.user.userID);
  const userPicture = pathResult[0].PicturePath;
  const [textResult] = await selectSQL.getUserAboutMe(req.session.user.userID);
  const userText = textResult[0].AboutMe;

  const [tasklistResult] = await selectSQL.getUserTaskLists(req.session.user.userID);
  let tasklists = [];

  for (let i = 0; i < tasklistResult.length; i++) {
    const tasklistID = tasklistResult[i].TasklistID;

    // Fetch tasks for the current tasklistID
    const [tasks] = await selectSQL.getUserTasks(tasklistID);

    // Store the tasklist along with its tasks in the array
    tasklists.push({
      ...tasklistResult[i],
      tasks,
    });
  }
  const isEmpty = await utilities.isEmpty(tasklists);
  if (isEmpty) {
    console.log("this user has no tasklists currently");
    tasklists = false;
  }
  res.render("profile", {
    user: req.session.user,
    title: "My Profile",
    aboutMe: userText,
    picturePath: userPicture,
    userTaskCollection: tasklists,
  });
}

router.post("/", async function (req, res, next) {
  if (req.body.submitAboutMe) {
    const newAboutMe = req.body.aboutMeInput;
    const result = await dmlSQL.editUserAboutMe(newAboutMe, req.session.user.userID);
    //console.log(result);
  }
});

const upload = multer({
  dest: "public/images/profile-pictures/",
  limits: {
    fileSize: 5 * 1024 * 1024, // maximum file size: 5mb
  },
  fileFilter: function (req, file, cb) {
    // allowed file types
    const filetypes = /jpeg|jpg|png/;
    // check file type
    const mimetype = filetypes.test(file.mimetype);
    // check file extension
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      return cb(new Error("Only .jpeg, .jpg, and .png files are allowed"));
    }
  },
});

router.post("/upload-picture", upload.single("uploadedPictureFile"), async function (req, res, next) {
  if (req.body.submitPicture && req.session.user) {
    // Set the user cookie with the current session user data
    res.cookie("user", JSON.stringify(req.session.user), { signed: true, httpOnly: true, sameSite: "strict" });

    //Establishing file upload location & name
    const FilePath = req.file.path;
    const newFilename = "user-" + req.session.user.userID + path.extname(req.file.originalname);
    const newPicturePath = "public/images/profile-pictures/" + newFilename;
    await fs.rename(FilePath, newPicturePath);

    //Redefining relative filepath for DB storage
    let newPicturePathDB = "/images/profile-pictures/" + newFilename;
    const result = await dmlSQL.editUserPicturePath(newPicturePathDB, req.session.user.userID);

    renderProfile(req, res);
  }
});
module.exports = router;
