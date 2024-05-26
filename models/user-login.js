const Sequelize = require("sequelize");
const bcrypt = require("bcrypt")

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
    sendTo: Sequelize.ENUM("mobile", "email", "both"),
    otp: Sequelize.STRING,
    otp_expiry: Sequelize.DATE
});
UserLogin.beforeCreate( async (user, options) => {
    const salt = bcrypt.genSalt(10);
    console.log(user.password);
    user.password = await bcrypt.hash(user.password,  parseInt(salt))
    console.log(user.password);
})

module.exports = UserLogin;
