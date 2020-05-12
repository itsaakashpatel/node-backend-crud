const postSchema = require('./../Database/Schemas/post')

class Post {
  async create(data) {

    try {
      let post = await new postSchema(data).save()

      //Return with Author details
      let getPost = await this.get(post._id)

      return {
        status : STATUS_CODES.CREATED,
        data : getPost
      };

    } catch (error) {
      throw error
    }
  }

  async get(postId) {
    try {
      let post = await postSchema.findById(mongoose.Types.ObjectId(postId))
                                  .populate({
                                    path    : 'author',
                                    select  : '_id first_name last_name surname email profile_pic role'
                                  })

      return {
        status : STATUS_CODES.SUCCESS,
        data : post
      };

    } catch (error) {
      throw error
    }
  }

  async edit(post, data) {
    try {
      
      for (let key in data) {
        post[key] = data[key]
      }
      
      await post.save();
      return {
        status : STATUS_CODES.SUCCESS,
        data : post
      };
    } catch (error) {
      throw error
    }

  }
  
  async delete(postId) {
    try {
      let post = await postSchema.deleteOne({ _id : mongoose.Types.ObjectId(postId)})

      return {
        status : STATUS_CODES.SUCCESS,
        data : post
      };

    } catch (error) {
      throw error
    }
  }

  async getPostDetails(postId) {
    return await postSchema.findById(mongoose.Types.ObjectId(postId))
                            .populate('author')
  }
}

module.exports = Post;
