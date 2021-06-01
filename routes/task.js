const express = require("express");
const router = express.Router();

router.post("/add/task", (req, res) => {
  const { task } = req.body;
  console.log(task);
});

module.exports = router;
