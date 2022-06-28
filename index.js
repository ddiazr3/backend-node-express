const express = require('express'),
    http = require('http'),
    path = require('path'),
    app = express(),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    config = require('./config'),
    mongoose = require('mongoose')
;

//todos los use
app.use(cors())
app.options('*',cors())
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended':'false'}));
app.use(express.static(path.join(__dirname, 'dist')));
app.use('/static', express.static('node_modules'));

//routas require
const login = require('./Routes/login'),
      empresa = require('./Routes/empresa');

/**
 * Use Routes
 */
app.use('/', login);
app.use('/empresas',empresa)

const server = http.Server(app)
const io = require('socket.io')(server,{
    cors:true,
    origin: config.URL_SOCKET_IO_GET
})
global.io = io;



/**
 * Conectado moongose
 * mongoose.Promise = require('bluebird');
 * mongoose.connect('mongodb://localhost/mevn-chat', { promiseLibrary: require('bluebird') })
 *   .then(() =>  console.log('connection succesful'))
 *   .catch((err) => console.error(err));
 */

server.listen(config.PORT, function () {
    console.log("**** puerto "+config.PORT)
})

app.get('/', (req, resp) => {
    resp.send("Hola mundo")
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});



io.on('connection', function (socket) {
    console.log("Connected succesfully to the socket ..."+socket.id);



    socket.on('disconnect', function () {
        console.log("**** desconectado*****");
    });
})
