const Sequelize = require("sequelize");
const bcrypt = require("bcrypt");

const sequelize = require("../util/database");

const UserLogin = sequelize.define("user-login", {
    id: {
        type: Sequelize.INTEGER,
        unique: true,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    firstName: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    lastName: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    mobile: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
    emailVerification: Sequelize.BOOLEAN,
    smsVerification: Sequelize.BOOLEAN,
    otp: Sequelize.STRING,
    otp_expiry: Sequelize.DATE,
});
UserLogin.beforeCreate(async (user, options) => {
    await passwordHashing(user, options);
});
UserLogin.beforeUpdate(async (user, options) => {
    await passwordHashing(user, options);
});

async function passwordHashing(user, options) {
    const salt = bcrypt.genSalt(10);
    console.log("===============>", user._changed["password"]);
    // is modified will check if the field is modified and if the dassword has not been modified it will return the another function
    if (user._changed["password"]) {
        user.password = await bcrypt.hash(user.password, parseInt(salt));
    }
}

module.exports = UserLogin;
