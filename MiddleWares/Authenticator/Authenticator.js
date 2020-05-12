const userSchema = require('./../../Database/Schemas/user')


class Authenticator {
    async authenticate(req, res, next) {
        let authToken = req.headers.authorization;
        if(!authToken) {
            res.handler.validationError(undefined, 'VALIDATION.TOKEN.INVALID');
            return false
        }
        const user =  await userSchema.findOne({
            authTokens : authToken
        })
        if(!user) {
            res.handler.unauthorized([], 'Unauthorized!');
            return;
        }
        let userInfo = user.toObject();
        delete userInfo.password
        delete userInfo.authTokens

        //ADDING USER TO REQUEST TO ACCESS FURTHER.
        req.userInfo = {
          id : userInfo._id,
          role: userInfo.role
        }
        next();
    }
}

module.exports = Authenticator;