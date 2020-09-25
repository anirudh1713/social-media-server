const User =  require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//get all users -- NO AUTH
exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.findAll();
        if (!users) throw new Error('no users found');
        res.send(users);
    }catch (e) {
        console.log(e.message);
        res.status(400).send({ error: e.message });
    }
}

//new user signup
exports.signUpUser = async (req, res, next) => {
    try {
        const { username, email, gender, loggedin: keepLogin } = req.body;
        let password = req.body.password;
        const dob = new Date(req.body.dob);
        password = await bcrypt.hash(password, 10);

        const user = await User.create({ username, email, gender, password, dob });
        const token = await jwt.sign({ user_id: user.user_id }, process.env.JWT_KEY);
        await user.createJwttoken({ jwttoken: token });
        res.status(201).send({ user, token });
    }catch (e) {
        console.log(e);
        res.status(400).send({ error: e.message });
    }
};

//login user
exports.loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) throw new Error('no user found');
        const isValidPass = await bcrypt.compare(password, user.password);
        if (!isValidPass) throw new Error('invalid credentials');
        const token = await jwt.sign({ user_id: user.user_id }, process.env.JWT_KEY);
        await user.createJwttoken({ jwttoken: token });
        res.send({ user, token });
    } catch (e) {
        console.log(e.message);
        res.status(400).send({ error: e.message });
    }
};