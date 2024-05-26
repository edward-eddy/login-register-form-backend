const userDataModel = require("../models/user-data");

createUserDetails = (req, res) => {
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
        userId,
    } = req.body;
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
            userId
        })
        .then(() => {
            res.status(202).json(createdUser);
        })
        .catch((error) => {
            res.status(400).json({ error: error.message });
        });
};

exports.updateUserDetails = async (req, res) => {
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
        userId,
    } = req.body;
    const userDetails = await userDataModel.findOne({ where: {userId }});
    try {
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
                .then(() => {
                    res.status(201).json({message:"", updatedUser});
                })
                .catch((error) => {
                    res.status(400).json({ error: error.message });
                });
        } else {
            const createdUser = await createUserDetails(req, res);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
