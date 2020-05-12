/* 
 * Generate Access Token
 */
function generateAccessToken() {
    let randomString = require("randomstring"),
        Encrypt = require('./../Configs/encrypt'),
        encrypt = new Encrypt();

    let tokenString = randomString.generate({
        length: 25,
        charset: 'alphanumeric'
    });

    return encrypt.encryptEntity(tokenString);
}

module.exports = {
    generateAccessToken,
}