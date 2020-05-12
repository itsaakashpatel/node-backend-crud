const express = require('express')
const router = express.Router()

const UsersController = require('./../Controllers/user');
const usersController = new UsersController();

const Authenticator = require('./../MiddleWares/Authenticator/Authenticator')
const authenticate =  (new Authenticator()).authenticate;

//VALIDATIONS
const { signUpValidations, loginValidations, validate } = require('./../MiddleWares/Validations')

//ROUTES

router.route('/signup')
    .post(upload.single('profile_pic'),signUpValidations(), validate, usersController.signup)
router.route('/login')
    .post(loginValidations(),validate, usersController.login)

//ADMIN SPECIFIC ROUTES
router.route('/all')
    .get(authenticate, usersController.allUsers)

// router.route('/profile')
//     .get(UsersController.getUserProfile)
//     .post(UsersController.addUserProfile)
//     .put(UsersController.updateUserProfile)
//     .delete(UsersController.removeUserProfile)

module.exports = router