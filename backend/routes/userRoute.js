const express = require("express");
const {  getUserFriends, addRemoveFriend ,getUserByjwt , setCodeforcesHandle,searchUsers,getUserObjId, getAllUsers,searchFriends} = require("../controllers/userController.js");
const { verifyToken } = require("../middleware/authMiddleware.js");


const router = express.Router();

/* READ */
// router.get("/:id", verifyToken, getUser);
router.get("/getUserByjwt", verifyToken, getUserByjwt);
router.get("/:id/friends", verifyToken, getUserFriends);
router.get('/searchUsers',verifyToken,searchUsers);
router.get("/getUserObjId/:id", getUserObjId);
router.get("/getAllUsers", getAllUsers);
router.get('/friends/search', verifyToken, searchFriends);
router.post("/setCodeforcesHandle/:handle", verifyToken, setCodeforcesHandle);

/* UPDATE */
router.patch("/:id/:friendId",  addRemoveFriend);
// router.patch("/:id/:friendId", verifyToken, addRemoveFriend, searchUsers);

module.exports = router;