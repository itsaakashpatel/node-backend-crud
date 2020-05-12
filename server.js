// PARSE .ENV
require('dotenv').config();
const http = require('http');

const express = require('express') // NODE FRAMEWORK
const bodyParser = require('body-parser') // TO PARSE POST REQUEST
const cors = require('cors') // ALLOW CROSS ORIGIN REQUESTS

// ---------------------------    SERVER CONFIGS ----------------------------------
const port = process.env.PORT || 8000
const app = express();
require('./Configs/globals'); // GLOBAL SETTINGS FILES

const server = http.createServer(app)


// ------------------------      GLOBAL MIDDLEWARES -------------------------
app.use(bodyParser.json()) // ALLOW APPLICATION JSON
app.use(bodyParser.urlencoded({ extended: false })) // ALLOW URL ENCODED PARSER
app.use(cors()) // ALLOWED ALL CROSS ORIGIN REQUESTS
app.use(express.static(__dirname + '/Assets')); // SERVE STATIC IMAGES FROM ASSETS FOLDER

// ------------------------    RESPONSE HANDLER    -------------------
app.use((req, res, next) => {
    const ResponseHandler = require('./Configs/responseHandler')
    res.handler = new ResponseHandler(req, res);
    next()
})


// --------------------------    ROUTES    ------------------
const appRoutes = require('./Routes')
appRoutes(app)


// --------------------------    GLOBAL ERROR HANDLER    ------------------
app.use ((err, req, res, next) => {
    if (res.headersSent) {
        return next(err)
    }
    res.handler.serverError(err)
})

// --------------------------    UnhandledPromiseRejection ERROR HANDLER    ------------------
process.on('unhandledRejection', error => {
  console.log('unhandledRejection', error.message, {ERROR : error});
  //ADD LOGS
});

// --------------------------    START SERVER    ---------------------
server.listen(port, () => {
    console.log(`Server is running on ${port}`)
})