const express = require('express');
const router = express.Router();

const PostController = require('./postController');
postController = new PostController();

const Authenticator = require('./../../shared/middlewares/authenticator');
authenticate = new Authenticator().authenticate;

//VALIDATIONS
const {validate} = require('./../../shared/middlewares/validate');
const {postValidations} = require('./postValidations');

//ROUTES
router
  .route('/:id?')
  .get(authenticate, postController.get)
  .post(authenticate, postValidations(), validate, postController.create)
  .put(authenticate, postValidations(), validate, postController.edit)
  .delete(authenticate, postController.delete);

module.exports = router;
