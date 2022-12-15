const express = require("express");
const cookieParser = require("cookie-parser");
const nunjucks = require("nunjucks");
const mongoose = require("mongoose");
const flash = require("connect-flash");
require("https").globalAgent.options.rejectUnauthorized = false;
require("dotenv").config();
const {
  handleInvalidUrlErrors,
  handleCustomErrors,
} = require("./errors/errors");
var passport = require("passport");
var session = require("express-session");
const MongoStore = require("connect-mongo");
const { Server } = require("socket.io");
const http = require("http");
const app = express();
const server = http.createServer(app);
const io = new Server(server);
const connect = require("./socket/connect.js");

// routes
const home = require("./routes/home.js");
const auth = require("./routes/auth.js");
const questions = require("./routes/questions.js");
const poll = require("./routes/poll.js");
const student = require("./routes/student.js");

// express middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("dist"));
const sessionMiddleware = session({
  secret: process.env.SECRET,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  saveUninitialized: false,
  resave: false,
  // cookie: {secure: true} // for use with HTTPS
});
app.use(sessionMiddleware);
app.use(passport.authenticate("session"));
app.use(flash());

// Socket io
// convert a connect middleware to a Socket.IO middleware
const wrap = (middleware) => (socket, next) =>
  middleware(socket.request, {}, next);

io.use(wrap(sessionMiddleware));

// only allow authenticated users
io.use((socket, next) => {
  try {
    const user = socket.request.session.passport.user;
    socket.user = user;
    next();
  } catch (e) {
    next(new Error("unauthorized"));
  }
});

io.on("connect", (socket) => connect(io, socket));

// SS rendering
nunjucks.configure("views", {
  autoescape: true,
  express: app,
});

// DATABASE
mongoose.set("strictQuery", true);
//Set up default mongoose connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  ignoreUndefined: true,
});

//Get the default connection
const db = mongoose.connection;

// Bind connection to error event (to get notification of connection errors)
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// routes
app.use("/", home);
app.use("/auth", auth);
app.use((req, res, next) => {
  // const { url } = req;
  if (!req.isAuthenticated()) {
    // req.session.targetUrl = url;
    // req.session.save();
    return res.redirect(`/auth/login`);
  }
  res.locals.user = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  res.locals.baseUrl = process.env["ORIGIN_URI"];
  res.locals.joinUrl = process.env["JOIN_URI"];
  next();
});
app.use('/student', student);
app.use((req, res, next) => {
  if (req.user.role === 'student') {
    return res.redirect('/student');
  }
  next();
})
app.use("/poll", poll);
app.use("/questions", questions);
app.all("*", handleInvalidUrlErrors);
app.use(handleCustomErrors);

const { PORT = 3000 } = process.env;
console.log(`Listening on port ${PORT}...`);
server.listen(PORT);
