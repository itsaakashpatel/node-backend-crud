const { check, validationResult } = require('express-validator')

//SCHEMAS
const userSchema = require('./../Database/Schemas/user')

const signUpValidations = () => {
  return [
    // username must be an email
    check('first_name').not()
            .isEmpty()
            .withMessage('First name is required'),
    check('last_name').not()
            .isEmpty()
            .withMessage('Last name is required'),
    check('surname').not()
            .isEmpty()
            .withMessage('Surname is required'),

    check('mobile').not()
            .isEmpty()
            .withMessage('Mobile is required'),
    check('email', 'Email is required')
                  .isEmail().withMessage('Email is not valid').normalizeEmail().custom(async email => {
      //Check if email is available to register
      return await userSchema.findOne({ email: email}).then(user => {
        if (user) {
          return Promise.reject('E-mail already in use, please use different');
        }
      });
    }),

    check('password', 'Password is required').not()
                    .isEmpty()
                    .withMessage('Password is required'),

    check('c_password', 'Confirm password is required').custom((value, { req }) => {

      if (value === "") throw new Error('Confirm password is required');
      if (value !== req.body.password) {
        throw new Error('Password confirmation does not match password');
      } 
      // Indicates the success of this synchronous custom validator
      return true;
    }),

    check('address').not()
                    .isEmpty()
                    .withMessage('Address is required'),
    check('profile_pic').not()
                    .isEmpty()
                    .withMessage('Profile pic is required'),
    check('dob').not()
                .isEmpty()
                .withMessage(' Date of birth is required'),
    check('role', 'Role is required')
                .isIn([ROLES.ADMIN, ROLES.USER]).withMessage('Role value is not valid!')
  ]
}

const loginValidations = () => {
  return [
    check('email', 'Email is required')
                    .isEmail().withMessage('Email is not valid').normalizeEmail(),

    check('password', 'Password is required').not()
                    .isEmpty()
                    .withMessage('Password is required'),
  ]
}

const postValidations = () => {
  return [
    check('title', 'Title is required').not()
    .isEmpty()
    .withMessage('Title is required'),

    check('body', 'body is required').not()
                    .isEmpty()
                    .withMessage('body is required'),
  ]
}

const validate = (req, res, next) => {
  const errors = validationResult(req)
  //If no error then go next...
  if (errors.isEmpty()) {
    return next()
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