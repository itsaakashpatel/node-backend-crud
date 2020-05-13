const express = require('express')
const router = express.Router()

const PostController = require('./../Controllers/post'),
      postController = new PostController();

const Authenticator = require('./../MiddleWares/Authenticator/Authenticator'),
      authenticate =  (new Authenticator()).authenticate;

//VALIDATIONS
const { postValidations, validate } = require('./../MiddleWares/Validations')
//ROUTES
router.route('/:id?')
    .get(authenticate, postController.get)
    .post(authenticate, postValidations(), validate, postController.create)
    .put(authenticate, postValidations(), validate, postController.edit)
    .delete(authenticate, postController.delete)

module.exports = router