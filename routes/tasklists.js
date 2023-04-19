var express = require("express");
var selectSQL = require("../models/select-queries.js");
var dmlSQL = require("../models/dml-queries.js");
var router = express.Router();
const utilities = require("../models/utilities.js");

router.get("/", async function (req, res, next) {
  if (!req.session.user) {
    res.render("login", { user: req.session.user, title: "Login", usernameError: null, passwordError: null });
  } else {
    renderTaskLists(req, res);
  }
});

async function renderTaskLists(req, res) {
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
    console.log("this object is empty");
  }
  res.render("tasklists", {
    user: req.session.user,
    title: "My Tasklists",
    userTaskCollection: tasklists,
  });
}

router.post("/", async function (req, res, next) {
  let taskName, tasklistName, taskDeadline, taskDesc, tasklistID, taskID, result;

  if (req.body.submitNewTask) {
    taskName = req.body.taskName;
    tasklistName = req.body.tasklist;
    taskDeadline = req.body.deadline;
    taskDesc = req.body.taskDescription;
    const [tasklists] = await selectSQL.getUserTaskLists(req.session.user.userID);
    for (let i = 0; i < tasklists.length; i++) {
      if (tasklistName == tasklists[i].TasklistName) {
        tasklistID = tasklists[i].TasklistID;
        break;
      }
    }

    result = await dmlSQL.createNewTask(taskName, taskDesc, taskDeadline, tasklistID);
    if (result) {
      const [tasks] = await selectSQL.getUserTasks(tasklistID);
      const countOfTasks = tasks.length;
      await dmlSQL.checkTaskListCompletion(tasklistID, countOfTasks);
      renderTaskLists(req, res);
    }
  }
  if (req.body.markAsComplete) {
    tasklistID = req.body.tasklistID;
    taskID = req.body.taskID;
    result = await dmlSQL.completeTask(tasklistID, taskID);
    if (result) {
      const [tasks] = await selectSQL.getUserTasks(tasklistID);
      const countOfTasks = tasks.length;
      await dmlSQL.checkTaskListCompletion(tasklistID, countOfTasks);
      renderTaskLists(req, res);
    }
  }
  if (req.body.submitNewTasklist) {
    tasklistName = req.body.newTasklistName;
    result = await dmlSQL.createNewTasklist(tasklistName, req.session.user.userID);
    if (result) {
      renderTaskLists(req, res);
    }
  }
  if (req.body.submitEditTasklist) {
    tasklistName = req.body.editedTasklistName;
    tasklistID = req.body.editedTasklistID;
    result = await dmlSQL.editTasklist(tasklistName, tasklistID);
    if (result) {
      renderTaskLists(req, res);
    }
  }
  if (req.body.submitDeleteTasklist) {
    tasklistName = req.body.deleteTasklist;
    console.log(tasklistName);
    const [tasklists] = await selectSQL.getUserTaskLists(req.session.user.userID);
    for (let i = 0; i < tasklists.length; i++) {
      if (tasklistName == tasklists[i].TasklistName) {
        tasklistID = tasklists[i].TasklistID;
        break;
      }
    }
    result = await dmlSQL.deleteTasklist(tasklistID);
    if (result) {
      renderTaskLists(req, res);
    }
  }
});

module.exports = router;
