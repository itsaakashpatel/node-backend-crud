const express = require('express');
const router = express.Router();

const UsersController = require('./userController');
const usersController = new UsersController();

//VALIDATIONS
const {validate} = require('./../../shared/middlewares/validate');
const {signUpValidations, loginValidations} = require('./userValidations');

//ROUTES

router
  .route('/signup')
  .post(upload.single('profile_pic'), signUpValidations(), validate, usersController.signup);
router.route('/login').post(loginValidations(), validate, usersController.login);

module.exports = router;
