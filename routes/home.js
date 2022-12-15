const express = require("express");
const { serializeUser } = require("passport");
const router = express.Router();

router.get("/", (req, res) => {
  if (req.isAuthenticated()) {
    if (req.user.role === 'teacher' || req.user.role === 'admin') {
      return res.redirect('questions');
    } else {
      return res.redirect('/student');
    }
  }
  return res.render("home.njk");
});

module.exports = router;
