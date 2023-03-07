const db = require('../models');
const JWT = require('jsonwebtoken');
const authUtils = require('../utils/authUtils'); 

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
      const token = JWT.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1D' });
      //if(authUtils.verifyJWT(token)) 
      await global.redisClient.set(username, token);
      return { token: token, success: true };
    }
  }
  return false;
};

const verifyJWT = async (token) => {
  const decoded = JWT.verify(token, process.env.JWT_SECRET);
  if(!decoded) return false;
  const user = await db.user.findOne({ where: { username: decoded.username } });
  // if (user) {
  //   return true;
  // }
  // return false;
  const savedToken = await global.redisClient.get(user.username);
  if (savedToken !== token) {
    return false;
  }
  return true;
};
  

module.exports = {
  addUser,
  verifyUser,
  verifyJWT
};