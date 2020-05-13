const { check, validationResult } = require('express-validator')
const path = require('path')
const fs = require('fs')
const moment = require('moment')

//SCHEMAS
const userSchema = require('./../Database/Schemas/user')

const signUpValidations = () => {
  return [
    check('first_name').trim().isLength({ min: 1 })
            .withMessage('First name is required'),
    check('last_name').trim().isLength({ min: 1 })
            .withMessage('Last name is required'),
    check('surname').trim().isLength({ min: 1 })
            .withMessage('Surname is required'),

    check('mobile').trim().isLength({ min: 1 })
            .withMessage('Mobile is required')
            .isNumeric()
            .withMessage('Only numeric values are allowed'),

    check('email').trim().isLength({ min: 1 })
                  .withMessage('Email is required')
                  .isEmail().withMessage('Email is not valid').normalizeEmail().custom(async email => {
      //Check if email is available to register
      return await userSchema.findOne({ email: email}).then(user => {
        if (user) {
          return Promise.reject('E-mail already in use, please use different');
        }
      });
    }),

    check('password').trim().isLength({ min: 1 })
                    .withMessage('Password is required'),

    check('c_password').trim().isLength({ min: 1 }).withMessage('Confirm Password is required').custom((value, { req }) => {
      if (value && value !== req.body.password) {
        throw new Error('Password confirmation does not match password');
      } 
      return true;
    }),

    check('address').trim().isLength({ min: 1 })
                    .withMessage('Address is required'),
    check('profile_pic').trim().isLength({ min: 1 })
                    .withMessage('Profile pic is required'),

    check('dob').trim().isLength({ min: 1 }).withMessage('Date of birth is required')
                .custom(date => {
                  if(date && !moment(date, 'YYYY-MM-DD', true).isValid()) {
                    throw new Error('Date of birth format is invalid');
                  }
                  return true
                })
                .withMessage(' Date of birth format is not valid'),

    check('role', 'Role is required')
                .isIn([ROLES.ADMIN, ROLES.USER]).withMessage('Role value is not valid!')
  ]
}

const loginValidations = () => {
  return [
    check('email').trim().isLength({ min: 1 })
    .withMessage('Email is required')
    .isEmail().withMessage('Email is not valid').normalizeEmail(),

    check('password').trim().isLength({ min: 1 })
                    .withMessage('Password is required'),
  ]
}

const postValidations = () => {
  return [
    check('title').trim().isLength({ min: 1 })
                  .withMessage('Title is required'),

    check('body').trim().isLength({ min: 1 })
                  .withMessage('body is required'),
  ]
}

const validate = (req, res, next) => {
  const errors = validationResult(req)
  //If no error then go next...
  if (errors.isEmpty()) {
    return next()
  }

  //Check if profile pic is set, if yes then remove it first
  if(req.body.profile_pic) {
    let getFileFromLocal = path.join( __dirname , './../Assets/profile_pics/' + req.body.profile_pic)
    fs.unlinkSync(getFileFromLocal)
    console.log(`${req.body.profile_pic} Profile Pic is removed`)
  }

  const extractedErrors = []
  errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))

  return res.handler.validationError(undefined,'Validation Error', errors)
}

module.exports = {
  signUpValidations,
  loginValidations,
  postValidations,
  validate,
}