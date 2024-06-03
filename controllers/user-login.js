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

exports.login = async (req, res) => {
    const { email, password } = req.body;
    // Check if the user with the given email exists in our DB
    const user = await userLoginModel.findOne({ email });

    if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
    } else if (!user.verified) {
        return res.status(403).json({
            message:
                "Please enter your OTP to verify your account.\nYou can find it in your mail inbox",
        });
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
        res.status(500).json({ message: "Internal server error" });
    }
};

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
            verified: false,
        })
        .then(async (data) => {
            await this.sendOtp(req, res);
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
};

exports.sendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        const otp = Math.floor(100000 + Math.random() * 900000);
        const date = new Date();

        const user = await userLoginModel.update(
            {
                otp,
                otp_expiry: date.setMinutes(date.getMinutes() + 10),
            },
            { where: { email } }
        );
        // Configure Nodemailer
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            // service: "gmail",
            auth: {
                name: "qtech",
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD,
            },
            tls: {
                rejectUnauthorized: false,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: "Your OTP Code",
            text: `Your OTP code is ${otp} \nThis OPT will expire after 10 minutes.`,
        };

        transporter
            .sendMail(mailOptions)
            .then(() => {
                res.status(200).json({
                    message: `OTP sent successfully to ${email},\n Go check your mailbox`,
                });
            })
            .catch((error) => {
                res.status(500).json({
                    message: "Error sending email", error
                });
            });
    } catch (error) {
        res.json({ message: error.message });
    }
};

exports.verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const user = await userLoginModel.findOne({ email });

        if (user.otp !== otp) {
            res.status(401).json({
                message: "Wrong OTP,\nCheck your mail again",
            });
        } else if (user.otp === otp && user.otp_expiry < new Date()) {
            res.status(410).json({ message: "Your OTP has been expired \nRequest another one." });
        } else {

            await user.update({ verified: true });
            res.status(200).json({
                message: "Your account has been verified.\n You can login now.",
            });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// module.exports = {
//     login,
//     register,
//     sendOtp,
//     verifyOtp,
// };
