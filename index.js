let express =  require('express');
var bodyParser = require('body-parser');
var session		=	require('express-session');
var indexRouter = require('./routes/router');

let app = express();

// Setting here
app.set('view engine', 'hbs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({secret: 'hdd',saveUninitialized: true,resave: true,cookie: { maxAge: 30*60*1000 }}));
app.use('/', indexRouter);

server = app.listen(process.env.PORT || 8082,() => {
    console.log('Server is listenning');
});
var io = require('socket.io')(server);
io.on('connection', function(socket){
    socket.username= "Anonymous";

    socket.on('change_username',(data)=>{
        socket.username = data.username;
    });
    socket.on('send_message',(data)=>{
        //send message to all clien
        console.log(data);
        io.sockets.emit('send_message',{message: data.message, username: socket.username});
    })
});



