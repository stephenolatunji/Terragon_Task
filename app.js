// jshint esversion:6

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 4004;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const userSchema = new mongoose.Schema({
    name: String,
    password: String,
    profession: String,
    id: Number
});
const User = mongoose.model('User', userSchema);

mongoose.connect('mongodb://localhost:27017/userDB', { useUnifiedTopology: true, useNewUrlParser: true });


app.route('/users')
    .get((req, res) => {
        User.find((err, listUsers) => {
            if (err) {
                res.send(err)
            }
            res.send(listUsers)
        });
    })

    .post((req, res) => {
        const addUser = new User({
            name: req.body.name,
            password: req.body.password,
            profession: req.body.profession,
            id: req.body.id
        });
        addUser.save((err) => {
            if (err) {
                res.send(err);
            } else {
                res.send('New user added');
            }
        });
    });

app.route('/users/:userId')
    .delete((req, res) => {
        User.deleteOne({ id: req.params.userId }, (err) => {
            if (err) {
                res.send(err)
            } else {
                res.send('user has been deleted');
            }
        });
    })
    .get((req, res) => {
        User.findOne({ id: req.params.userId }, (err, foundUser) => {
            if (foundUser) {
                res.send(foundUser);
            } else {
                res.send('User Not Found!')
            }
        });
    });


app.listen(port, () => {
    console.log(`Server started on port ${port}`);
})



