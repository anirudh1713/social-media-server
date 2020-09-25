const User = require('../models/user');
const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
  try {
    const authToken = req.headers.authorization.split(' ')[1];
    if (!authToken) throw Error('unauthorized');
    let userId = await jwt.verify(authToken, process.env.JWT_KEY);
    userId = userId.user_id;
    if (!userId) throw Error('unauthorized');
    const user = await User.findByPk(userId);
    if (!user) throw Error('user not found');
    let tokens = await user.getJwttokens();
    tokens = JSON.stringify(tokens);
    tokens = JSON.parse(tokens);
    if (tokens.length <= 0) throw new Error('unauthorized');
    const isValidToken = tokens.find(tk => {
      return authToken === tk.jwttoken;
    });
    if (!isValidToken) throw new Error('invalid token');
    req.user = user;
    req.token = authToken;
    next();
  }catch (e) {
    console.log(e);
    res.status(400).send({ error: e.message });
  }
};

module.exports = auth;