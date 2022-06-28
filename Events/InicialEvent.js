function countCar() {
    var news = [
        {title: 'The cure of the Sadness is to play Videogames', date: '04.10.2016'},
        {title: 'Batman saves Racoon City, the Joker is infected once again', date: '05.10.2016'},
        {title: "Deadpool doesn't want to do a third part of the franchise", date: '05.10.2016'},
        {title: 'Quicksilver demand Warner Bros. due to plagiarism with Speedy Gonzales', date: '04.10.2016'},
    ];
    io.emit('news', news.length)
}

module.exports = {
    countCar
}
