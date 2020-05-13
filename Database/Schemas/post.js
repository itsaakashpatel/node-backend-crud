const postsSchema = mongoose.Schema({
  title: { type: String, required: true, index: true},
  body: { type: String, required: true},
  author: {type: mongoose.Schema.Types.ObjectId, ref: 'user'}
}, {
  timestamps : true
})

module.exports = mongoose.model('Post', postsSchema)