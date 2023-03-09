const {validationResult} = require('express-validator');
const path = require('path');
const fs = require('fs');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  //If no error then go next...
  if (errors.isEmpty()) {
    return next();
  }

  //Check if profile pic is set, if yes then remove it first
  if (req.body.profile_pic) {
    let getFileFromLocal = path.join(
      __dirname,
      './../../assets/profile_pics' + req.body.profile_pic
    );
    fs.unlinkSync(getFileFromLocal);
    console.log(`${req.body.profile_pic} Profile Pic is removed`);
  }

  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({[err.param]: err.msg}));

  return res.handler.validationError(undefined, 'Validation Error', errors);
};

module.exports = {
  validate,
};
