const Sequelize = require("sequelize");

const sequelize = require("../util/database");
const UserLogin = require("./user-login");

const UserData = sequelize.define("user-data", {
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
    enName: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    arName: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    dob: {
        type: Sequelize.DATEONLY,
        allowNull: false,
    },
    gender: {
        type: Sequelize.ENUM("male", "female"),
        allowNull: false,
    },
    nationality: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    country: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    city: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    fullAddress: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    social: Sequelize.JSON,
    bref: Sequelize.STRING,
    imageUrl: Sequelize.STRING,
    userId: {
        type: Sequelize.INTEGER,
        unique: true,
        allowNull: false,
        references: {
            model: UserLogin,
            key: "id",
        },
    },
});

module.exports = UserData;
