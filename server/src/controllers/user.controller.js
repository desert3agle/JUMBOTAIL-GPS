const User = require("../models/user.model");
const jwt = require('jsonwebtoken');
const { isValidMail } = require('../utils/validation.utils');


const maxAge = 7 * 24 * 60 * 60;
    const createToken = (id) => {
    return jwt.sign({ id }, process.env.TOKEN_KEY, {
        expiresIn: maxAge
    });
};

exports.addUser = async(req, res) => {
    try {

        const { first_name, last_name, email, password } = req.body;

        if (!(email && password && first_name && last_name)) {
            return res.status(400).send({ message : "All input is required"});
        }

        if(!isValidMail(email)){
            return res.status(400).send({ message : "invalid mail"});
        }

        if(password.length < 6){
            return res.status(400).send({ message : "password is too small"});
        }

        const oldUser = await User.findOne({ email });

        if (oldUser) {
            return res.status(409).send({ message : "User Already Exist. Please Login" });
        }

        const user = await User.create({
            first_name,
            last_name,
            email: email.toLowerCase(), 
            password
        });

        const token = createToken(user._id);

        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(201).json({ user, token });

    } catch (err) {
        res.status(500).send({ message : err.message});
    }
}

exports.loginUser = async(req, res) => {

    try {

        const { email, password } = req.body;

        if (!(email && password)) {
            res.status(400).send({ message : "All input is required"});
        }

        if(!isValidMail(email)){
            return res.status(400).send({ message : "invalid Mail ID" });
        }

        const user = await User.login(email, password);
        const token = createToken(user._id);

        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(200).json({ user, token });
    } catch (err) {
        res.status(400).send({ message : err.message });
    }
}


exports.checkUser = async (req, res ) => {
    try{
        let currentUser;

        if (req.cookies.jwt) {
            const token = req.cookies.jwt;
            const decoded = jwt.verify(token, process.env.TOKEN_KEY);

            currentUser = await User.findById(decoded.id);
        } else {
            currentUser =  null;
        }    
        res.status(200).json(currentUser);
    }catch(err){
        res.status(500).send({ message : err.message });
    }
}


exports.logoutUser = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.status(200).send({ message : 'user is logged out' });
}