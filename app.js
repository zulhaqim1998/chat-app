var express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    path = require('path'),
    passport = require('passport'),
    cookieParser = require('cookie-parser'),
    router = require('./routes/router'),
    config = require('./config/main'),
    //http = require('http').Server(app),
    //io = require('socket.io')(http);
    server = app.listen(config.port),
    io = require('socket.io').listen(server);

mongoose.connect(config.database);
mongoose.connection.on('connected', function(){
  console.log('Connected to mongoDB');
});
mongoose.connection.on('error', function(err){
  console.log('Error connecting to DB: ' + err);
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});
router(app);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', function(socket){
  console.log('User connected');
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
  socket.on('disconnect', function(){
    console.log('User disconnected');
  });
});

// app.listen(3000, function(){
//   console.log('Server is running on http://localhost:3000');
// });
 console.log('Server is running on http://localhost:3000');
