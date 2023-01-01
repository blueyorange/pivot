const express = require("express");
const router = express.Router();

router.get("/:pollId", async (req, res, next) => {
  return res.render('poll.njk');
});

module.exports = router;
