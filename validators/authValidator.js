const Joi = require("joi");
const jwt = require("jsonwebtoken");

const validateRegister = (req, res, next) => {
    const schema = Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().email().required(),
        mobile: Joi.string().pattern(new RegExp("^[0-9]{11}$")).required(),
        password: Joi.string().min(6).required(),
        confirmPassword: Joi.any().valid(Joi.ref("password")).required(),
        terms: Joi.boolean().truthy(),
        emailVerification: Joi.boolean(),
        smsVerification: Joi.boolean()
    });

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    next();
};

const validateLogin = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    next();
};

const validateProfile = (req, res, next) => {
    // console.log(req.body.profileData);
    const schema = Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        enName: Joi.string().required(),
        arName: Joi.string().required(),
        gender: Joi.string().valid("male", "female").required(),
        dob: Joi.date().required(),
        nationality: Joi.string().required(),
        country: Joi.string().required(),
        city: Joi.string().required(),
        fullAddress: Joi.string().required(),
        social: Joi.object(),
        bref: Joi.string().allow(null).allow(""),
        imageUrl: Joi.string(),
    });

    const { error } = schema.validate(req.body.profileData);
    if (error){
        console.log("Joi error: ", error);
        return res.status(400).json({ error: error.details[0].message, error });
}
    next();
};


const isTokenValid = (req, res, next) => {
    let decoded = jwt.decode(req.headers.token, process.env.JWT_SECRET);
    decoded
        ? next()
        : res.status(401).json({ message: "Invalid token, logOut" });
}

module.exports = { validateRegister, validateLogin, validateProfile, isTokenValid };
