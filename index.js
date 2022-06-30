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
app.options('*', cors())
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended': 'false'}));
app.use(express.static(path.join(__dirname, 'dist')));
app.use('/static', express.static('node_modules'));
app.use(express.json())
app.use(express.urlencoded({extended:false}))

//se coloca abajo por la configuracion del body parser
const rutas = require('./Routes/routesConfig')(app);

const server = http.Server(app)
const io = require('socket.io')(server, {
    cors: true,
    origin: config.URL_SOCKET_IO_GET
})
global.io = io;


/**
 * Conectado moongose
 */
const DATABASE_URL = process.env.DATABASE_URL || 'http://localhost:27017';

mongoose.connect(`mongodb://${DATABASE_URL}/controlTicket`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Mongo conectado")
}).catch(err => {
    console.log(`error db ${err.message}`)
    process.exit(1)
});


server.listen(config.PORT, function () {
    console.log("**** puerto " + config.PORT)
})

app.get('/', (req, resp) => {
    resp.send("Hola mundo")
})

app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


io.on('connection', function (socket) {
    console.log("Connected succesfully to the socket ..." + socket.id);
    socket.on('disconnect', function () {
        console.log("**** desconectado*****");
    });
})
