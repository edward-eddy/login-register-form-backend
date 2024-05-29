const express = require("express");
const sequelize = require("./util/database");
const cors = require("cors");
require("dotenv").config();

const app = express();

const userLoginRoutes = require("./routes/user-login");
const userDataRoutes = require("./routes/user-data");

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/userAuth", userLoginRoutes);
app.use("/userData", userDataRoutes);

// Handle not found middleware
app.use("*", function (req, res, next) {
    res.status(404).json({ message: "notfound" });
});

// Error handling middleware
app.use((err, req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : 500;
    return res.status(statusCode).json({
        message: err.message ? err.message : "Internal Server Error",
    });
});

sequelize
    .sync()
    .then((result) => {
        // console.log("Database synchronized:", result);
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Error synchronizing database:", err);
    });
