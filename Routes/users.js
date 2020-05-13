const express = require('express')
const router = express.Router()

const UsersController = require('./../Controllers/user');
const usersController = new UsersController();

//VALIDATIONS
const { signUpValidations, loginValidations, validate } = require('./../MiddleWares/Validations')

//ROUTES

router.route('/signup')
    .post(upload.single('profile_pic'),signUpValidations(), validate, usersController.signup)
router.route('/login')
    .post(loginValidations(),validate, usersController.login)

module.exports = router