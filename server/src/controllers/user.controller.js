const User = require("../models/user.model");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { isValidMail } = require('../utils/validation.utils');

exports.addUser = async(req, res) => {
    try {

        const { first_name, last_name, email, password } = req.body;

        if (!(email && password && first_name && last_name)) {
            return res.status(400).send("All input is required");
        }

        if(!isValidMail(email)){
            return res.status(400).send("invalid mail");
        }

        if(password.length < 6){
            return res.status(400).send("password is too small");
        }

        const oldUser = await User.findOne({ email });

        if (oldUser) {
            return res.status(409).send("User Already Exist. Please Login");
        }

        encryptedPassword = await bcrypt.hash(password, 10);


        const user = await User.create({
            first_name,
            last_name,
            email: email.toLowerCase(), 
            password: encryptedPassword,
        });

        const token = jwt.sign(
            { user_id: user._id, email },
            process.env.TOKEN_KEY,
            {
            expiresIn: "2h",
            }
        );
        user.token = token;
        res.status(201).json(user);
    } catch (err) {
        res.status(500).send("server error");
    }
}

exports.loginUser = async(req, res) => {

    try {

        const { email, password } = req.body;

        if (!(email && password)) {
            res.status(400).send("All input is required");
        }

        if(!isValidMail(email)){
            return res.status(400).send("invalid mail");
        }

        const user = await User.findOne({ email });

        if(!user){
            return res.status(404).send({
                message: "user not found"
            })
        };
        let isValid = await bcrypt.compare(password, user.password);
        if (isValid) {
            const token = jwt.sign(
            { user_id: user._id, email },
            process.env.TOKEN_KEY,
            {
                expiresIn: "2h",
            }
        );
        user.token = token;

        res.status(200).json(user);
    }
    else{
        return res.status(400).send("Invalid Credentials");
    }
    } catch (err) {
        res.status(500).send("server error");
    }
}