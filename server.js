require('dotenv').config()

const express = require('express');
const cors = require('cors');
const sequelize = require('./db/db');

const app = express();

const port = process.env.PORT || 30001;

//routes imports
const userRoute = require('./routes/user');
const postRoute = require('./routes/post');
const commentRoute = require('./routes/comment');
const friendRoute = require('./routes/friend');

//model imports
const User = require('./models/user');
const Post = require('./models/post');
const Comment = require('./models/comment');
const Jwttoken = require('./models/jwttoken');
const Friend = require('./models/friend');

//-------START model relations----------

//user-friend
User.belongsToMany(User, { as: 'receiver', through: Friend });
Friend.belongsTo(User);

//user-post
User.hasMany(Post);
Post.belongsTo(User);

//user-token
User.hasMany(Jwttoken);
Jwttoken.belongsTo(User);

//user-comment
User.hasMany(Comment);
Comment.belongsTo(User);

//post-comment
Post.hasMany(Comment);
Comment.belongsTo(Post);

//-------END model relations------------

//middleware
app.use(express.json());
app.use(cors());

//routes middleware
app.use(userRoute);
app.use(postRoute);
app.use(commentRoute);
app.use(friendRoute);

//server start
sequelize.sync({ force: false }).then(res => {
    app.listen(port, (err) => {
        if (err) throw err;
        console.log(`---- Server sterted on port ${port} ----`);
    });
}).catch(err => {
    console.log(`unexpected error : ${err}`);
});
