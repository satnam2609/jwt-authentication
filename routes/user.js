const express = require("express");
const {
  userRegister,
  userLogin,
  getUser,
  updatePassword,
  logOut,
} = require("../controllers/user");

const router = express.Router();

router.post("/user/register", userRegister);
router.post("/user/login", userLogin);
// router.put("/user/update-password", updatePassword);
// router.delete("/user/logout", logOut);
router.get("/user", getUser);

module.exports = router;
