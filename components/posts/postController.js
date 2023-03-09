const PostModel = require('./postModel');
const postModel = new PostModel();

class PostsController {
  //CREATE POST
  async create(req, res) {
    const data = {
      ...req.body,
      author: req.userInfo.id,
    };

    try {
      let createNewPost = await postModel.create(data);
      if (createNewPost.status === STATUS_CODES.CREATED) {
        res.handler.created(createNewPost.data, 'New Post Data');
        return;
      }
      res.handler.success(createNewPost.data, []);
    } catch (error) {
      res.handler.serverError(error);
    }
  }

  //GET POST
  async get(req, res) {
    const postId = req.params.id;

    try {
      //CHECK IF POST ID AVAILABLE
      if (postId) {
        let getPost = await postModel.get(postId);
        //CHECK IF POST EXISTS
        if (!getPost.data) {
          res.handler.notFound([], 'Post does not exist!');
          return;
        }

        if (getPost.status === STATUS_CODES.SUCCESS) {
          res.handler.success(getPost.data, 'Post Data');
          return;
        }
      }
      //IF POST ID IS NOT SEND WITH REQUEST
      res.handler.badRequest([], 'Bad request, post id is not shared');
      return;
    } catch (error) {
      res.handler.serverError(error);
    }
  }

  //EDIT POST
  async edit(req, res) {
    const authUserRole = req.userInfo.role;
    const postId = req.params.id;

    if (!postId) {
      //IF POST ID IS NOT SEND WITH REQUEST
      res.handler.badRequest([], 'Bad request, post id is not shared');
      return;
    }

    if (ROLES.ADMIN === authUserRole) {
      //CAN EDIT ANY POST
      try {
        let postDetails = await postModel.get(postId);
        //CHECK IF POST EXISTS
        if (!postDetails.data) {
          res.handler.notFound([], 'Post does not found!');
          return;
        }

        if (postDetails.status === STATUS_CODES.SUCCESS && postDetails.data) {
          let editPost = await postModel.edit(postDetails.data, req.body);
          if (editPost.status === STATUS_CODES.SUCCESS) {
            res.handler.success(editPost.data, 'Post edited successfully!');
            return;
          }
        }
      } catch (error) {
        console.log('PostsController -> edit -> error', error);
        res.handler.serverError(error);
      }
    }

    if (ROLES.USER === authUserRole) {
      const authUserId = req.userInfo.id;
      //USER CAN EDIT OWN CREATED POST ONLY
      try {
        let postDetails = await postModel.get(postId);
        //CHECK IF POST EXISTS
        if (!postDetails.data) {
          res.handler.notFound([], 'Post does not found!');
          return;
        }

        //CHECK IF POST EXISTS AND IS CREATED BY AUTHENTICATED USER OR NOT
        if (
          postDetails.status === STATUS_CODES.SUCCESS &&
          postDetails.data &&
          postDetails.data.author._id.equals(authUserId)
        ) {
          let editPost = await postModel.edit(postDetails.data, req.body);
          if (editPost.status === STATUS_CODES.SUCCESS) {
            res.handler.success(editPost.data, 'Post edited successfully!');
            return;
          }
        }

        res.handler.unauthorized([], 'You are not authorized to edit other users post');
        return;
      } catch (error) {
        res.handler.serverError(error);
      }
    }
  }

  //DELETE POST
  async delete(req, res) {
    const authUserRole = req.userInfo.role;
    const postId = req.params.id;

    if (ROLES.ADMIN === authUserRole) {
      //CHECK POST ID IS THERE
      if (postId) {
        //DELETE ANY POST
        try {
          let getPost = await postModel.get(postId);

          //CHECK IF POST EXISTS
          if (!getPost.data) {
            res.handler.notFound([], 'Post does not exist');
            return;
          }

          if (getPost.status === STATUS_CODES.SUCCESS && getPost.data) {
            let deletePost = await postModel.delete(postId);
            if (deletePost.status === STATUS_CODES.SUCCESS) {
              res.handler.success([], 'Post deleted successfully!');
              return;
            }
          }
        } catch (error) {
          res.handler.serverError(error);
        }
      }
      //IF POST ID IS NOT SEND WITH REQUEST
      res.handler.badRequest([], 'Bad request, post id is not shared');
      return;
    }

    if (ROLES.USER === authUserRole) {
      const authUserId = req.userInfo.id;
      //CHECK POST ID IS THERE
      if (postId) {
        //USER CAN DELETE OWN CREATED POST ONLY
        try {
          let getPost = await postModel.get(postId);

          //CHECK IF POST EXISTS
          if (!getPost.data) {
            res.handler.notFound([], 'Post does not exist');
            return;
          }

          //CHECK IF POST EXISTS AND IS CREATED BY AUTHENTICATED USER OR NOT
          if (
            getPost.status === STATUS_CODES.SUCCESS &&
            getPost.data &&
            getPost.data.author._id.equals(authUserId)
          ) {
            let deletePost = await postModel.delete(postId);
            if (deletePost.status === STATUS_CODES.SUCCESS) {
              res.handler.success([], 'Post deleted successfully!');
              return;
            }
          }

          res.handler.unauthorized([], 'You are not authorized to delete other users post');
          return;
        } catch (error) {
          res.handler.serverError(error);
        }
      }
      //IF POST ID IS NOT SEND WITH REQUEST
      res.handler.badRequest([], 'Bad request, post id is not shared');
      return;
    }
  }
}

module.exports = PostsController;
