// const Post = require("../models/post.js");
// const User = require("../models/user.js");

// /* CREATE */
// const createPost = async (req, res) => {
//   try {
//     const { userId, description, picturePath } = req.body;
//     const user = await User.findById(userId);
//     const newPost = new Post({
//       userId,
//       firstName: user.firstName,
//       lastName: user.lastName,
//       location: user.location,
//       description,
//       userPicturePath: user.picturePath,
//       picturePath,
//       likes: [],
//       comments: [],
//     });
//     await newPost.save();

//     const post = await Post.find();
//     res.status(201).json(post);
//   } catch (err) {
//     res.status(409).json({ message: err.message });
//   }
// };

// /* READ */
// const getFeedPosts = async (req, res) => {
//   try {
//     const post = await Post.find();
//     res.status(200).json(post);
//   } catch (err) {
//     res.status(404).json({ message: err.message });
//   }
// };

// // const getUserPosts = async (req, res) => {
// //   try {
// //     const { userId } = req.params;
// //     const post = await Post.find({ userId });
// //     res.status(200).json(post);
// //   } catch (err) {
// //     res.status(404).json({ message: err.message });
// //   }
// // };
// const getUserPosts = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const posts = await Post.find({ userId });
    
//     // Map through each post and include the parent comment ID if available
//     const updatedPosts = posts.map(post => ({
//       ...post.toObject(),
//       comments: post.comments.map(comment => ({
//         ...comment.toObject(),
//         parentId: comment.parentId ? comment.parentId : null
//       }))
//     }));

//     res.status(200).json(updatedPosts);
//   } catch (err) {
//     res.status(404).json({ message: err.message });
//   }
// };


// /* UPDATE */
// const likePost = async (req, res) => {
//   try {
//     const { id } = req.params;
//     console.log(req.user); // Ensure req.user is populated by your authentication middleware
//     const  userId  = req.user.id;
    
//     const post = await Post.findById(id);
//     if (!post) {
//       return res.status(404).json({ message: 'Post not found' });
//     }

//     const isLiked = post.likes.includes(userId);

//     if (isLiked) {
//       post.likes = post.likes.filter(id => id !== userId);
//     } else {
//       post.likes.push(userId);
//     }

//     const updatedPost = await Post.findByIdAndUpdate(
//       id,
//       { likes: post.likes },
//       { new: true }
//     );
    
//     res.json({ message: 'Successful', likes: updatedPost.likes });
//   } catch (error) {
//     console.error('Error updating likes:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };
// const addComment = async (req, res) => {
//   const { postId } = req.params;
//   const { userId, firstName, lastName, content, parentCommentId } = req.body;

//   try {
//     // Find the post by ID
//     const post = await Post.findById(postId);

//     // Create a new comment object
//     const newComment = {
//       userId,
//       firstName,
//       lastName,
//       content,
//       parentCommentId,
//     };

//     // If parentCommentId is provided, find the parent comment and add the new comment as a reply
//     if (parentCommentId) {
//       const parentComment = post.comments.find(comment => comment._id === parentCommentId);
//       if (parentComment) {
//         // Check if parent comment has a 'replies' array, if not create it
//         if (!parentComment.replies) {
//           parentComment.replies = [];
//         }
//         parentComment.replies.push(newComment);
//       } else {
//         return res.status(404).json({ error: 'Parent comment not found' });
//       }
//     } else {
//       // If no parentCommentId provided, add the new comment to the post's comments array
//       post.comments.push(newComment);
//     }

//     // Save the updated post
//     const updatedPost = await post.save();

//     // Include parentCommentId in the response
//     res.status(201).json({ message: 'Comment posted successfully', comment: { ...newComment, _id: updatedPost.comments.slice(-1)[0]._id } });
//   } catch (error) {
//     console.error('Error posting comment:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };


// module.exports = {createPost , getUserPosts , likePost, getFeedPosts,addComment} ;

const Post = require("../models/post.js");
const User = require("../models/user.js");

const createPost = async (req, res) => {
  try {
    const { userId, description, picturePath } = req.body;
    const user = await User.findById(userId);
    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      likes: [],
      comments: [],
    });
    await newPost.save();

    const posts = await Post.find();
    res.status(201).json(posts);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

const getFeedPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const posts = await Post.find({ userId });
    
    // Map through each post and include the parent comment ID if available
    // const updatedPosts = posts.map(post => ({
    //   ...post.toObject(),
    //   comments: post.comments.map(comment => ({
    //     ...comment.toObject(),
    //     parentId: comment.parentComment ? comment.parentComment : null
    //   }))
    // }));

    res.status(200).json(posts);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
const getComments =async (req, res) => {
  const postId = req.params.postId;

  try {
      // Find the post by postId
      const post = await Post.findById(postId);

      if (!post) {
          return res.status(404).json({ message: 'Post not found' });
      }

      // Return comments of the post
      res.json({ comments: post.comments });
  } catch (error) {
      console.error('Error fetching comments:', error);
      res.status(500).json({ message: 'Server error' });
  }
}
const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const isLiked = post.likes.includes(userId);

    if (isLiked) {
      post.likes = post.likes.filter(id => id !== userId);
    } else {
      post.likes.push(userId);
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );
    
    res.json({ message: 'Successful', likes: updatedPost.likes });
  } catch (error) {
    console.error('Error updating likes:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const addComment = async (req, res) => {
  const { postId } = req.params;
  const { userId, firstName, lastName, content, parentId } = req.body;

  try {
    // Find the post by ID
    const post = await Post.findById(postId);

    // Create a new comment object
    const newComment = {
      userId,
      firstName,
      lastName,
      content,
      parentId, 
    };

    // If parentCommentId is provided, find the parent comment and add the new comment as a reply
    // if (parentCommentId) {
    //   const parentComment = post.comments.find(comment => comment._id === parentCommentId);
    //   if (parentComment) {
    //     // Check if parent comment has a 'replies' array, if not create it
    //     if (!parentComment.replies) {
    //       parentComment.replies = [];
    //     }
    //     parentComment.replies.push(newComment);
    //   } else {
    //     return res.status(404).json({ error: 'Parent comment not found' });
    //   }
    // } else {
    //   // If no parentCommentId provided, add the new comment to the post's comments array
    //   post.comments.push(newComment);
    // }
    post.comments.push(newComment);

    // Save the updated post
    const updatedPost = await post.save();

    // Include parentCommentId in the response
    res.status(201).json({ message: 'Comment posted successfully', newComment });
  } catch (error) {
    console.error('Error posting comment:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { createPost, getUserPosts, likePost, getFeedPosts, addComment, getComments};
