const { Users } = require("../models");

const createUser = async (userData) => {
  // console.log(userData);
  const user = new Users(userData);
  return await user.save();
};

const getUserByEmail = async (email) => {
  return await Users.findOne(email);
};

const emailVerification = async (id, updatedData) => {
  return await Users.updateOne({ id }, { $set: updatedData });
};

module.exports = {
  createUser,
  getUserByEmail,
  emailVerification,
};
