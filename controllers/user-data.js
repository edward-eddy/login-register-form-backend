const jwt = require("jsonwebtoken");
const userDataModel = require("../models/user-data");
const userLoginModel = require("../models/user-login");

var userIdFromHeaders = (req) => {
    var userId;
    const { token } = req.headers;
    if (token) {
        try {
            userId = jwt.decode(token).id;
        } catch (err) {
            console.log(err);
        }
    }
    return userId;
};

exports.getUserById = (req, res) => {
    const userId = userIdFromHeaders(req);
    try {
        const userData = userDataModel
            .findOne({ where: { userId } })
            .then((data) => {
                res.status(202).json({data, userData});
            })
            .catch((error) => {
                error.message === 'WHERE parameter "userId" has invalid "undefined" value'
                ? res.status(404).json({ message: "املأ بياناتك الشخصية" })
                : res.status(401).json({ message: error.message })
            });
    } catch(error){
        res.status(500).json({error, message: "Internal server error"})
    }
};

createUserDetails = (req, res) => {
    const userId = userIdFromHeaders(req);
    const {
        firstName,
        lastName,
        enName,
        arName,
        dob,
        gender,
        nationality,
        country,
        city,
        fullAddress,
        social,
        bref,
        imageUrl,
    } = req.body.profileData;
    const createdUser = userDataModel
        .create({
            firstName,
            lastName,
            enName,
            arName,
            dob,
            gender,
            nationality,
            country,
            city,
            fullAddress,
            social,
            bref,
            imageUrl,
            userId,
        })
        .then(() => {
            res.status(201).json(createdUser);
        })
        .catch((error) => {
            // console.log("cud error",error.message);
            res.status(401).json({ error: error.message });
        });
};

exports.updateUserDetails = async (req, res) => {
    const userId = userIdFromHeaders(req);
    const {
        firstName,
        lastName,
        enName,
        arName,
        dob,
        gender,
        nationality,
        country,
        city,
        fullAddress,
        social,
        bref,
        imageUrl,
    } = req.body.profileData;
    try {
        const userDetails = await userDataModel.findOne({ where: { userId } })
        if (userDetails) {
            const updatedUser = userDataModel
                .update(
                    {
                        firstName,
                        lastName,
                        enName,
                        arName,
                        dob,
                        gender,
                        nationality,
                        country,
                        city,
                        fullAddress,
                        social,
                        bref,
                        imageUrl,
                    },
                    {
                        where: { userId },
                    }
                )
                .then((response) => {
                    res.status(201).json({ message: "", updatedUser });
                })
                .catch((error) => {
                    res.status(400).json({ error: error.message });
                });
        } else {
            const createdUser = await createUserDetails(req, res);
        }
    } catch (error) {
        // console.log("uud error",error.message);
        error.message === 'WHERE parameter "userId" has invalid "undefined" value'
        ? await createUserDetails(req, res)
        : res.status(500).json({ error: error.message });
    }
};
