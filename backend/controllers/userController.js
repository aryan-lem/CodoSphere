const User =  require("../models/user.js");


/* READ */
// const getUser = async (req, res) => {
//   try {
//     const { id } = req.params;
//     // const user = await User.findById(id);
//   console.log('first')
//     const user = await User.findById(uu.id._id);
//     res.status(200).json(user);
//   } catch (err) {
//     res.status(404).json({ message: err.message });
//     // res.status(404).json({uu });
//   }
// };
 const getAllUsers = async (req, res) => {
    try {
      const users = await User.find({});
      res.status(200).json(users);
    } catch (err) {
      res.status(404).json({ message: err.message });
      // res.status(404).json({uu });
    }
  };

const searchUsers=async (req, res) => {
  const query = req.query.query;

  // Check if the query parameter is provided
  if (!query) {
      return res.status(400).json({ message: "Query parameter is required" });
  }

  try {
      // Use a regular expression to perform a case-insensitive search
      const searchRegex = new RegExp(query, 'i');
      const users = await User.find({
          $or: [
              { firstName: searchRegex },
              { lastName: searchRegex }
          ]
      });

      // Return the found users
      res.json(users);
  } catch (err) {
      // Handle any errors that occur during the search
      res.status(500).json({ message: "Error searching users", error: err.message });
  }
}

const getUserByjwt = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.password=""
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
const getUserObjId = async (req, res) => {
  try {
    const { id } = req.params; // Corrected to access 'id' directly
    const user = await User.findById(id); // Access 'id' directly
    user.password = ""; // Ensure password is not sent in the response
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );
    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */
// const addRemoveFriend = async (req, res) => {
//   try {
//     const { id, friendId } = req.params;
//     const user = await User.findById(id);
//     const friend = await User.findById(friendId);
//     console.log(friend);
//     if (user.friends.includes(friendId)) {
//       user.friends = user.friends.filter((id) => id !== friendId);
//       friend.friends = friend.friends.filter((id) => id !== id);
//     } else {
//       user.friends.push(friendId);
//       friend.friends.push(id);
//     }
//     await user.save();
//     await friend.save();

//     const friends = await Promise.all(
//       user.friends.map((id) => User.findById(id))
//     );
//     const formattedFriends = friends.map(
//       ({ _id, firstName, lastName, occupation, location, picturePath }) => {
//         return { _id, firstName, lastName, occupation, location, picturePath };
//       }
//     );

//     res.status(200).json(formattedFriends);
//   } catch (err) {
//     res.status(404).json({ message: err.message  });
    
//   }
// };
const addRemoveFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params;

    if (id === friendId) {
      return res.status(400).json({ message: "You cannot add/remove yourself." });
    }

    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    // if (!user || !friend) {
    //   return res.status(404).json({ message: "User not found." });
    // }

    // Check if the friend is already in the user's friend list
    if (user.friends.includes(friendId)) {
      // Remove friend from user's friend list
      user.friends = user.friends.filter(id => id.toString() !== friendId);
      // Remove user from friend's friend list
      friend.friends = friend.friends.filter(fid => fid.toString() !== id);
    } else {
      // Add friend to user's friend list
      user.friends.push(friendId);
      // Add user to friend's friend list
      friend.friends.push(id);
    }

    await user.save();
    await friend.save();

    res.status(200).json({ userFriends: user.friends, friendFriends: friend.friends });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




const setCodeforcesHandle = async (req, res) => {
  try {
    const { handle} = req.params;
    const userId=req.user.id;
    // Find the user by ID and update the codeForcesHandle field
    const user = await User.findByIdAndUpdate(
      userId,
      { codeForcesHandle: handle },
      { new: true, runValidators: true } // Return the updated document and run validators
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Send only the relevant user data in the response
    res.status(200).json({
      _id: user._id,
      codeForcesHandle: user.codeForcesHandle,
      // Add other fields you want to include in the response
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const searchFriends=async (req, res) => {
  const { q } = req.query;
  try {
    const friends = await User.find({
      $or: [
        { firstName: { $regex: q, $options: 'i' } },
        { lastName: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } }
      ]
    }).limit(10);
    res.json(friends);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
// const searchFriends = async (req, res) => {
//   const { q } = req.query;
//   const userId = req.user.id; // Assuming you have user ID available in the request
  
//   try {
//     // Find the current user and populate the friends field
//     const currentUser = await User.findById(userId).populate('friends');

//     // Extract the IDs of the friends
//     const friendIds = currentUser.friends.map(friend => friend._id);

//     // Query users where ID is in the list of friend IDs and matches the search query
//     const friends = await User.find({
//       _id: { $in: friendIds },
//       $or: [
//         { firstName: { $regex: q, $options: 'i' } },
//         { lastName: { $regex: q, $options: 'i' } },
//         { email: { $regex: q, $options: 'i' } }
//       ]
//     }).limit(10);

//     res.json(friends);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// }

module.exports = { getUserFriends , addRemoveFriend ,getUserByjwt , setCodeforcesHandle,searchUsers,getUserObjId,getAllUsers,searchFriends};



