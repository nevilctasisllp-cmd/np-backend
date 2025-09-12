import { Router } from "express";
import {
  loginUser,
  logoutuser,
  registerUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateUserAvatar,
  updateUserCoverImage,
  getUserChannelProfile,
  getWatchHistory,
} from "../controllers/user.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";
import JWT from "jsonwebtoken";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);

router.route("/login").post(loginUser);

// secured routes
router.route("/logout").post(verifyJWT, logoutuser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(verifyJWT, changeCurrentPassword);
router.route("/current-user").get(verifyJWt, getCurrentUser);
router.route("/update-Account").patch(verifyJWt, updateAccountDetails);
router
  .route("/avatar")
  .patch(verifyJWt, upload.single("avatar"), updateUserAvatar);
router
  .route("/cover-image")
  .patch(verifyJWt, upload.single("/coverImage"), updateUserCoverImage);
router.route("/c/:username").get(verifyJWt, getUserChannelProfile);
router.route("/history").get(verifyJWt, getWatchHistory);

export default router;
