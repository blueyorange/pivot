const express = require("express");
const router = express.Router();
const Poll = require("../models/poll.model.js");
const { marked } = require("marked");

router.get("/teacher/:joinCode", async (req, res, next) => {
  const { joinCode } = req.params;
  req.session.joinCode = joinCode;
  return Poll.findOne({ joinCode })
    .populate("question")
    .exec()
    .then((poll) => {
      return res.render("poll-teacher.njk", {
        q: poll.question,
        parse: marked.parse,
        joinCode,
      });
    })
    .catch((err) => next(err));
});

router.get("/:joinCode", async (req, res, next) => {
  const { joinCode } = req.params;
  req.session.joinCode = joinCode;
  return Poll.findOne({ joinCode })
    .populate("question")
    .then((poll) => {
      if (!poll) {
        return res.render("poll-reject.njk");
      } else {
        const { body, choices, _id } = poll.question;
        const q = { _id, body, choices };
        return res.render("poll-student.njk", {
          q,
          parse: marked.parse,
          userId: req.user._id,
          pollId: poll._id,
        });
      }
    })
    .catch((err) => next(err));
});

module.exports = router;
