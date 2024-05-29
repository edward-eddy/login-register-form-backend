const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

const userLoginModel = require("../models/user-login");

// Generate token
function generateToken(id) {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
    });
}

exports.register = (req, res) => {
    const {
        firstName,
        lastName,
        email,
        mobile,
        password,
        emailVerification,
        smsVerification,
    } = req.body;
    const newUser = userLoginModel
        .create({
            firstName,
            lastName,
            email,
            mobile,
            password,
            emailVerification,
            smsVerification,
        })
        .then((data) => {
            console.log("reg success");
            res.status(201).json(newUser, data);
        })
        .catch((error) => {
            console.log("reg failed", error.errors[0]);
            res.status(400).json({ error });
        });
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    console.log("validateLogin==================>", email, password);
    // Check if the user with the given email exists in our DB
    const user = await userLoginModel.findOne({ email });

    if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
    }
    try {
        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) {
            return res
                .status(401)
                .json({ message: "Invalid email or password" });
        }
        res.status(200).json({ token: generateToken(user.id), user });
    } catch (error) {
        // Handle any errors related to bcrypt.compare() here
        console.error("Error comparing passwords:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const sendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        const otp = Math.floor(100000 + Math.random() * 900000);

        // Configure Nodemailer
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: "Your OTP Code",
            text: `Your OTP code is ${otp}`,
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "OTP sent successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
