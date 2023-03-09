const usersSchema = mongoose.Schema(
  {
    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    mobile: {type: Number, required: true},
    email: {type: String, required: true, unique: true, index: true},
    password: {type: String, required: true},
    profile_pic: {type: String, required: true},
    dob: {type: Date, required: true},
    role: {type: String, required: true, enum: [ROLES.USER, ROLES.ADMIN]},
    authTokens: [String],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('user', usersSchema);
