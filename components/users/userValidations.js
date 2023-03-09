const {check} = require('express-validator');
const moment = require('moment');

//SCHEMAS
const userSchema = require('./userSchema');

const signUpValidations = () => {
  return [
    check('first_name').trim().isLength({min: 1}).withMessage('First name is required'),
    check('last_name').trim().isLength({min: 1}).withMessage('Last name is required'),

    check('mobile')
      .trim()
      .isLength({min: 1})
      .withMessage('Mobile is required')
      .isNumeric()
      .withMessage('Only numeric values are allowed'),

    check('email')
      .trim()
      .isLength({min: 1})
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Email is not valid')
      .normalizeEmail()
      .custom(async (email) => {
        //Check if email is available to register
        return await userSchema.findOne({email: email}).then((user) => {
          if (user) {
            return Promise.reject('E-mail already in use, please use different');
          }
        });
      }),

    check('password').trim().isLength({min: 1}).withMessage('Password is required'),

    check('c_password')
      .trim()
      .isLength({min: 1})
      .withMessage('Confirm Password is required')
      .custom((value, {req}) => {
        if (value && value !== req.body.password) {
          throw new Error('Password confirmation does not match password');
        }
        return true;
      }),

    check('profile_pic').trim().isLength({min: 1}).withMessage('Profile pic is required'),

    check('dob')
      .trim()
      .isLength({min: 1})
      .withMessage('Date of birth is required')
      .custom((date) => {
        if (date && !moment(date, 'YYYY-MM-DD', true).isValid()) {
          throw new Error('Date of birth format is invalid');
        }
        return true;
      })
      .withMessage(' Date of birth format is not valid'),

    check('role', 'Role is required')
      .isIn([ROLES.ADMIN, ROLES.USER])
      .withMessage('Role value is not valid!'),
  ];
};

const loginValidations = () => {
  return [
    check('email')
      .trim()
      .isLength({min: 1})
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Email is not valid')
      .normalizeEmail(),

    check('password').trim().isLength({min: 1}).withMessage('Password is required'),
  ];
};

module.exports = {
  signUpValidations,
  loginValidations,
};
