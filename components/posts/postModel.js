const postSchema = require('./postSchema');

class Post {
  /**
   *
   * @param {Object} data Data that need to be store in DB
   */
  async create(data) {
    try {
      //Save new post
      let post = await new postSchema(data).save();

      //Return with Author details
      let getPost = await this.get(post._id);

      return {
        status: STATUS_CODES.CREATED,
        data: getPost,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   *
   * @param {String} postId Id of post
   */
  async get(postId) {
    try {
      let post = await postSchema.findById(mongoose.Types.ObjectId(postId)).populate({
        path: 'author',
        select: '_id first_name last_name surname email profile_pic role',
      });

      return {
        status: STATUS_CODES.SUCCESS,
        data: post,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   *
   * @param {Object} post Post object
   * @param {Object} data Data object
   */
  async edit(post, data) {
    try {
      for (let key in data) {
        post[key] = data[key];
      }

      await post.save();
      return {
        status: STATUS_CODES.SUCCESS,
        data: post,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   *
   * @param {String} postId Id of post
   */

  async delete(postId) {
    try {
      let post = await postSchema.deleteOne({
        _id: mongoose.Types.ObjectId(postId),
      });

      return {
        status: STATUS_CODES.SUCCESS,
        data: post,
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Post;
