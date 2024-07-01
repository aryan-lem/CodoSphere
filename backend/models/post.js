// const mongoose = require("mongoose");

// const postSchema = mongoose.Schema(
//   {
//     userId: {
//       type: String,
//       required: true,
//     },
//     firstName: {
//       type: String,
//       required: true,
//     },
//     lastName: {
//       type: String,
//       required: true,
//     },
//     location: String,
//     description: String,
//     picturePath: String,
//     userPicturePath: String,
//     likes: {
//       type: Array,
//       default: [],
//     },
//     comments: {
//       type: Array,
//       default: [],
//     },
//   },
//   { timestamps: true }
// );

// const Post = mongoose.model("Post", postSchema);

// module.exports = Post ;
const mongoose = require("mongoose");

// Define the comment schema first
const commentSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
  },
}, { timestamps: true });

// Define the post schema
const postSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    location: String,
    description: String,
    picturePath: String,
    userPicturePath: String,
    likes: {
      type: Array,
      default: [],
    },
    comments: {
      type: [commentSchema], // Array of comments
      default: [],
    },
  },
  { timestamps: true }
);

// Define the Post model
const Post = mongoose.model("Post", postSchema);

module.exports = Post;
