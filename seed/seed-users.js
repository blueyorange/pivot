const fs = require("fs");
const mongoose = require("mongoose");
require("dotenv").config();
const User = require("../models/user.model");
const Course = require('../models/course.model')

async function run() {
  console.log("Accessing db...");
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  await User.collection.drop();

  let users = JSON.parse(fs.readFileSync("./seed/data/users.json")).users;
  const result = await User.insertMany(users);
  console.log(result);
  const felix = await User.findOne({ id: '111392245021711687658' })
  const me = await User.findOne({ id: '112970617713664374486' });
  const course = await Course.create({ name: 'test', students: [felix._id], teacher: me._id });
  console.log(course);
}

run();
