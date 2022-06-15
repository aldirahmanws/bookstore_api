const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            return res.status(401).json({
                message: "Failed",
                error_key: "error_no_auth_token",
                error_message:
                    "Request tidak mendapati token access pada Header",
                error_data: {},
            });
        }
        const token = req.headers.authorization.split(" ")[1];

        const decoded = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        req.userData = decoded
        req.accessToken = token
        
        next();
    } catch (error) {
        if (error.message == "jwt expired") {
            return res.status(401).json({
                message: "Failed",
                error_key: "error_expired_token",
                error_message: "Token access pada Header sudah kadaluarsa",
                error_data: {},
            });
        } else {
            return res.status(401).json({
                message: "Failed",
                error_key: "error_invalid_token",
                error_message:
                    "Token access pada Header tidak sesuai ketentuan / settingan token",
                error_data: {},
            });
        }
    }
};
