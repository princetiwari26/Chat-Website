const router = require("express").Router();
const {
    checkUsername,
    register,
    login,
    logout,
    loggedProfile,
    getAllUser,
    searchUser,
    getUserProfile,
  } = require("../controllers/user.controller");
  const multer = require("multer");
  const isAuthenticated = require("../middleware/isAuthenticated");
  
  const upload = multer({ storage: multer.diskStorage({}) });
  
  router.post("/check-username", checkUsername);
  router.post("/register", upload.single("profilePicture"), register);
  router.post("/login", login);
  router.get("/logout", isAuthenticated, logout);
  router.get("/profile", isAuthenticated, loggedProfile);
  router.get("/getAllUser", isAuthenticated, getAllUser);
  router.get("/searchUsers", isAuthenticated, searchUser);
  router.get("/:username", isAuthenticated, getUserProfile)
  
  module.exports = router;
  