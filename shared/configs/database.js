const mongoose = require('mongoose');
const url = `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/?authMechanism=${process.env.DB_AUTH_SOURCE}&authSource=${process.env.DB_DATABASE}`;

//BUILD A CONNECTION
mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('connection established');
  })
  .catch((err) => console.log('Database connection error!', err));

//REPLACE MONGOOSE PROMISE BY BLUEBIRD
mongoose.Promise = require('bluebird');

module.exports.mongoose = mongoose;
