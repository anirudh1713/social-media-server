const User =  require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Jwttoken = require('../models/jwttoken');

//get all users -- NO AUTH
exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.findAll({ include: { all: true } });
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

//code for profile image
const { Storage } = require('@google-cloud/storage');
const storage = new Storage({
    projectId: process.env.GCLOUD_PROJECT_ID,
    keyFilename: process.env.GCLOUD_APPLICATION_CREDENTIALS
});
const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET_URL_PROFILE);
//profile image add
exports.addProfileImage = async (req, res, next) => {
    try {
        if (!req.file) res.status(400).send('no file found');
        //name the file
        const blob = bucket.file(`profile_images/${req.user.user_id}_${req.file.originalname}`);
        //create blob in bucket referencing the file
        const blobWriter = blob.createWriteStream({
            metadata: {
                contentType: req.file.mimetype
            }
        });
        blobWriter.on('error', (err) => {
            console.log(err);
        });
        blobWriter.on('finish', () => {
            const url = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/profile_images%2F${encodeURI(blob.name.split('/')[1])}?alt=media`;
            req.user.update({ profile_photo: url }).then(response => {
                res.send({ profile_url: url });
            }).catch(e => {
                console.log(e);
                res.status(500).send({ error: e.message });
            });
        });
        blobWriter.end(req.file.buffer);
    } catch (e) {
        console.log(e);
        res.status(500).send({ error: e.message });
    }
};

//get single user by id
exports.getUserData = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) res.status(404).send({ error: 'user not found' });
        res.send({ user });
    } catch(e) {
        console.log(e);
        res.status(500).send({ error: e.message });
    }
};

//log out user
exports.logoutUser = async (req, res, next) => {
    try {
        const { user, token } = req;
        await Jwttoken.destroy({ where: { userUserId: user.user_id, jwttoken: token } });
        res.send();
    } catch (e) {
        console.log(e);
        res.status(500).send({ error: e.message });
    }
};