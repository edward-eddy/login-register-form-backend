const express = require("express");
const sequelize = require("./util/database");
require("dotenv").config();

const app = express();

const userLoginRoutes = require("./routes/user-login");
const userDataRoutes = require("./routes/user-data");

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/userAuth", userLoginRoutes);
app.use("/userData", userDataRoutes);
// handle not found not found middleware
app.use("*", function (req, res, next) {
    res.status(404).json({ message: "notfound" });
});

app.use((err, req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : 500;
    return res.status(statusCode).json({
        message: err.message? err.message : "Internal Server Error",
    });
});

sequelize
    .sync()
    .then((result) => {
        app.listen(PORT || 3000);
    })
    .catch((err) => {
        console.log(err);
    });
