const {check} = require('express-validator');
const postValidations = () => {
  return [
    check('title').trim().isLength({min: 1}).withMessage('Title is required'),

    check('body').trim().isLength({min: 1}).withMessage('body is required'),
  ];
};

module.exports = {
  postValidations,
};
