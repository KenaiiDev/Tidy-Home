const express = require("express");
const router = express.Router();

const { validateToken } = require("../middlewares/validateToken");

const {
  register,
  login,
  validate,
  userByConfirmationCode,
  userById,
} = require("../controllers/auth.controller");

router.get("/validate/:confirmationCode", validate);

router.post("/register", register);
router.post("/login", login);

router.param("confirmationCode", userByConfirmationCode);
router.param("userId", userById);

module.exports = router;
