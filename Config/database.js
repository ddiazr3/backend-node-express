const mongoose = require('mongoose')

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
