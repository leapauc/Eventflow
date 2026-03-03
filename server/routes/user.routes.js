const express = require("express");
const router = express.Router();

const {
  loginUser,
  registerUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/user.controller");

// Public
router.post("/auth/login", loginUser);
router.post("/auth/register", registerUser);

// Admin
router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
