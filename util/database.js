const Sequelize = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize("qtech", "root", process.env.MYSQL_PASSWORD, {
    dialect: "mysql",
    host: "localhost",
});

module.exports = sequelize;
