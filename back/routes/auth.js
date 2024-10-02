const {
    login,
    register,
    getAllUsers,
    logOut,
    getUserById,
} = require("../controllers/user.js");

const router = require("express").Router();

router.post("/login", login);
router.post("/register", register);
router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);

// router.get("/logout/:id", logOut);

module.exports = router;