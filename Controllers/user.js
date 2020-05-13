const UserModel = require('./../Models/user');
const userModel = new UserModel();

class UsersController {
  //LOGIN
  async login(req, res) {
    const data = req.body
    try {
      let loginUser = await userModel.login(data)

      if (loginUser.status === STATUS_CODES.SUCCESS) {
          res.handler.success(loginUser.data, loginUser.message);
          return;
      }

      if(loginUser.status === STATUS_CODES.UNAUTHORIZED) {
        res.handler.unauthorized([], loginUser.message);
        return;
      }

      if(loginUser.status === STATUS_CODES.NOT_FOUND) {
        res.handler.notFound([], loginUser.message);
        return;
      }
      res.handler.success(data.data);
    } catch (error) {
      res.handler.serverError(error)
    }
    
  }

  //SIGN UP
  async signup(req, res) {
    // const { first_name, last_name, surname, email, mobile, password, profile_pic, address, dob, role, c_password} = req.body
    const data = req.body
    try {
      let createNewUser = await userModel.signUp(data)
      if (createNewUser.status === STATUS_CODES.CREATED) {
        res.handler.created(createNewUser.data, 'New User Data');
        return;
      }    
      res.handler.success(createNewUser.data, []);
    } catch (error) {
      res.handler.serverError(error)
    }
  }

}

module.exports = UsersController;