const userSchema = require('./userSchema');

class User {
  /**
   *
   * @param {Object} data Data that need to be store in DB
   */

  async login(data) {
    try {
      //Find one user from DB
      let user = await userSchema.findOne({
        email: data.email,
      });

      if (user) {
        //Compare user password with fetched user password
        let Encrypt = require('./../../shared/configs/encrypt');
        const encrypt = new Encrypt();
        const isPasswordMatch = encrypt.compareEncryptEntity(data.password, user.password);

        // If password doesn't match then no login should happen.
        if (isPasswordMatch) {
          //Generate Access Token and return to client
          let accessToken = require('../../shared/utils/helpers').generateAccessToken();

          //Save new token to DB
          user.authTokens.push(accessToken);
          await user.save();

          return {
            status: STATUS_CODES.SUCCESS,
            message: 'User info',
            data: {
              first_name: user.first_name,
              last_name: user.last_name,
              surname: user.surname,
              mobile: user.mobile,
              profile_pic: user.profile_pic,
              address: user.address,
              dob: user.dob,
              role: user.role,
              email: user.email,
              authToken: accessToken,
            },
          };
        } else {
          return {
            status: STATUS_CODES.UNAUTHORIZED,
            message: 'Unauthorized',
          };
        }
      } else {
        return {
          status: STATUS_CODES.NOT_FOUND,
          message: 'Email does not found!',
        };
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   *
   * @param {Object} data Data that need to be store in DB
   */

  async signUp(data) {
    let accessToken = require('./../../shared/utils/helpers').generateAccessToken(),
      Encrypt = require('./../../shared/configs/encrypt'),
      encrypt = new Encrypt(),
      encryptPassword = encrypt.encryptEntity(data.password);

    //hash password and store token and password to DB
    data.password = encryptPassword;
    data.authTokens = [accessToken];
    data.dob = new Date(data.dob);
    console.log('🚀 ~ file: userModel.js:79 ~ User ~ signUp ~ data:', data);

    try {
      let user = await new userSchema(data).save();
      return {
        status: STATUS_CODES.CREATED,
        data: {
          authToken: accessToken,
          first_name: user.first_name,
          last_name: user.last_name,
          mobile: user.mobile,
          profile_pic: user.profile_pic,
          dob: user.dob,
          role: user.role,
          email: user.email,
        },
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = User;
