const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./../../models/user');

const authenticate = async (req, res) => {
    try {
        const { email, password } = { ...req.body };
        const user = await User.findOne({ email: email.toLowerCase() });
        if (user && bcrypt.compareSync(password, user.hash)) {
            const token = jwt.sign({
                id: user._id,
                name: user.name,
                email: user.email
            }, process.env.SITE_SECRET);
            res.status(200).json({ name: user.name, access_token: token });
        } else {
            res.status(400).json({ message: `Incorrect combination of email and password` });
        }
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

const createUser = async (req, res) => {
    try {
        const { email, password } = { ...req.body };
        delete req.body.password;
        const isUserExists = await User.findOne({ email: email.toLowerCase() });
        if (password) {
            req.body.hash = bcrypt.hashSync(password, 10);
        }
        if (!isUserExists) {
            const user = new User(req.body);
            await user.save();
            res.status(200).json({ message: `${email} registered successfully` });
        } else {
            res.status(400).json({ message: `${email} already exists` });
        }
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

// routes
router.post('/authenticate', authenticate);
router.post('/create', createUser);

module.exports = router;