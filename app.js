const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");

const app = express();

process.env.dirname = __dirname;

const indexRoute = require("./api/routes/indexRoute");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));
app.use(morgan("dev"));
// Handle CORS
app.use((request, response, next) => {
    response.header("Access-Control-Allow-Origin", "*");
    response.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (request.method === "OPTIONS") {
        response.header(
            "Access-Control-Allow-Methods",
            "PUT, POST, PATCH, DELETE, GET"
        );
        return response.status(200).json({});
    }
    next();
});

app.use("/", indexRoute);

// Handle Error
app.use((request, response, next) => {
    const error = new Error("API Invalid");
    next(error);
});

app.use((error, request, response, next) => {
    response.status(error.status || 500).json({
        message: error.message || "Failed",
        error_key: error.error_key || "error_internal_server",
        error_message: error.error_message || error.message,
        error_data: error.error_data || {},
    });
});

module.exports = app;
