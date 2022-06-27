const expres = require('express'),
    http = require('http'),
    app = expres(),
    cors = require('cors'),
    puerto = 3000;

app.use(cors())

const server = http.Server(app)

const io = require('socket.io')(server)

app.options('*',cors())

server.listen(puerto, function () {
    console.log("****")
})

app.get('/', (req, resp) => {
    resp.send("Hola mundo")
})

app.use('/static', expres.static('node_modules'));

io.on('connection', function (socket) {
    console.log("Connected succesfully to the socket ...");

    var news = [
        {title: 'The cure of the Sadness is to play Videogames', date: '04.10.2016'},
        {title: 'Batman saves Racoon City, the Joker is infected once again', date: '05.10.2016'},
        {title: "Deadpool doesn't want to do a third part of the franchise", date: '05.10.2016'},
        {title: 'Quicksilver demand Warner Bros. due to plagiarism with Speedy Gonzales', date: '04.10.2016'},
    ];

    // Enviar noticias al socket
    socket.emit('news', news);

    socket.on('disconnect', function () {
        console.log("**** desconectado*****");
    });
})
