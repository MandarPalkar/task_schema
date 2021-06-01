const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../config/auth");
const Task = require("../models/Task");

router.get("/", ensureAuthenticated, (req, res) => res.render("welcome"));

router.get("/dashboard", ensureAuthenticated, async (req, res) => {
  const allTasks = await Task.find({ email: req.user.email });

  res.render("dashboard", {
    name: req.user.name,
    email: req.user.email,
    allTasks,
  });
});

router.post("/add/task", ensureAuthenticated, (req, res) => {
  const { task, email } = req.body;
  const newTask = new Task({ task, email });
  newTask
    .save()
    .then(() => {
      console.log("task added");
      req.flash("success_msg", "Task added successfully");

      res.redirect("/dashboard");
    })
    .catch((err) => console.log(err));
});

router.get("/delete/task/:_id", (req, res) => {
  const { _id } = req.params;

  Task.deleteOne({ _id })
    .then(() => {
      console.log("Task deleted successfully");
      res.redirect("/dashboard");
    })
    .catch((err) => console.log(err));
});

// router.get("/update/task/:_id", (req, res) => {
//   const { _id } = req.params;

//   Task.update({ _id }, { $task: {} });
// });

router.get("/update/task/:_id", (req, res) => {
  const id = req.params;
  Task.find({}, (err, tasks) => {
    console.log(tasks);
    console.log(tasks);
    res.render("update.ejs", { allTasks: tasks, TaskId: id });
  });
});

router.post("/update/task/:_id", (req, res) => {
  const id = req.params;
  Task.findByIdAndUpdate(id, { task: req.body.content }, (err) => {
    if (err) return res.send(500, err);
    res.redirect("/dashbaord");
  });
});

module.exports = router;
