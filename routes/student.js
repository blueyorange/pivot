const express = require("express");
const router = express.Router();
const Poll = require("../models/poll.model.js");
const { marked } = require("marked");

router.get("/", async (req, res) => {
    return res.render('student.njk');
});

module.exports = router;
