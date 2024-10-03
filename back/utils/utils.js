const { User } = require("../models");

const findUserById = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }
    return user;
  } catch (err) {
    console.error("Error fetching user data: ", err.message);
    throw err;
  }
};

module.exports = { findUserById };
