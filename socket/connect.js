const User = require('../models/user.model.js');
const Poll = require("../models/poll.model.js");
const Response = require("../models/response.model.js");
const Question = require("../models/question.model.js");

// room state objects identified by 4 character join code
const polls = new Map();

// holds current state of room
function createRoomState({ teacher }) {
  const studentsById = new Map();
  return Object.freeze({
    teacher,
    studentsById
  })
}

function createStudentState({ user, questions }) {
  const responses = [];
  return Object.freeze({ id: user._id, name: user.name.givenName, questions, responses, isConnected: true })
}

function connect(io, socket) {
  const { user } = socket;
  let poll;

  socket.on("teacher", async (pollId, cb) => {
    const poll = await Poll.findById(pollId).populate('question').populate('teacher').populate('course').exec();
    // if (polls.has(pollId)) {
    //   poll = polls.get(pollId);
    // } else {
    //   if (!poll) return cb('no poll found');
    //   polls.set(pollId, poll);
    // }
    console.log(poll);
    socket.join(pollId);
    return cb(null, poll);
  });

  socket.on('student', async (cb) => {

  })

  socket.on("disconnect", () => {

  });

  socket.on("respond", async () => {

  });
}

module.exports = connect;
