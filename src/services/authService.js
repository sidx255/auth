const db = require("../models");
const JWT = require("jsonwebtoken");
const authUtils = require("../utils/authUtils");
require("dotenv").config();

const addUser = async (data) => {
  const { username, password } = data;
  const hashedPassword = await authUtils.hashPass(password);
  return await db.user.create({ username:username, password:hashedPassword });
};

const verifyUser = async (data) => {
  const { username, password } = data;
  const user = await db.user.findOne({ where: { username } });
  if (user) {
    const passwordMatch = await authUtils.checkAuth(password, user.password);
    if (passwordMatch) {
      const token = JWT.sign({ username }, process.env.JWT_SECRET, { expiresIn: "1D" });
      return { token: token, success: true };
    }
  }
  return false;
};

const verifyJWT = async (token) => {
  const decoded = JWT.verify(token, process.env.JWT_SECRET);
  const user = await db.user.findOne({ where: { username: decoded.username } });
  if (user) {
    return true;
  }
  return false;
};

module.exports = {
  addUser,
  verifyUser,
  verifyJWT
};