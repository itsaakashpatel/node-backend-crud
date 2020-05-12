const mongoose = require('mongoose')
const url = `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}?authSource=${process.env.DB_AUTH_SOURCE}`;


//BUILD A CONNECTION
mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex : true
}).then(() => { console.log('connection established')})
.catch( err => console.log('Database connection error!'));

//REPLACE MONGOOSE PROMISE BY BLUEBIRD
mongoose.Promise = require('bluebird');

module.exports.mongoose = mongoose