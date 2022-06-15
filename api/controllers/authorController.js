const authorService = require("../service/authorService");

exports.register = async (req, res) => {
    try {
        const { body } = req;
        if (!body.Name || !body.Pen_Name || !body.Email || !body.Password) {
            return res.status(200).json({
                message: "Failed",
                error_key: "error_param",
                error_message: "Ketentuan Path Param / Query Param untuk Pemanggilan API tidak sesuai",
                error_data: {}
            });
        }
        const newUser = {
            Name: body.Name,
            Pen_Name: body.Pen_Name,
            Email: body.Email,
            Password: body.Password
        }
        const createdUser = await authorService.createNewUser(newUser);
        return res.json({
            message: "Success"
        });
    } catch (error) {
        return res.status(error.status || 200).json({
            message: error.message || "Failed",
            error_key: error.error_key || "error_internal_server",
            error_message: error.error_message || error.message,
            error_data: error.error_data || {}
        });
    }
};

exports.login = async(req, res) => {
    try {
        const { body } = req;
        if (!body.Email || !body.Password) {
            return res.status(200).json({
                message: "Failed",
                error_key: "error_param",
                error_message: "Ketentuan Path Param / Query Param untuk Pemanggilan API tidak sesuai",
                error_data: {}
            });
        }
        const user = {
            Email: body.Email,
            Password: body.Password
        }

        const loginUser = await authorService.loginUser(user);
        return res.json({
            message: "Success",
            data: loginUser
        });
    } catch (error) {
        return res.status(error.status || 200).json({
            message: "Failed",
            error_key: error.error_key || "error_internal_server",
            error_message: error.error_message || error.message,
            error_data: error.error_data || {}
        });
    }
}

exports.logout = async(req, res) => {
    try {
        return res.json({
            message: "Success"
        });
    } catch (error) {
        return res.status(error.status || 200).json({
            message: "Failed",
            error_key: error.error_key || "error_internal_server",
            error_message: error.error_message || error.message,
            error_data: error.error_data || {}
        });
    }
}

exports.forgotPassword = async(req, res) => {
    try {
        const { body } = req;
        if (!body.Email) {
            return res.status(200).json({
                message: "Failed",
                error_key: "error_param",
                error_message: "Ketentuan Path Param / Query Param untuk Pemanggilan API tidak sesuai",
                error_data: {}
            });
        }

        const forgotPasswordUser = await authorService.forgotPasswordUser(body.Email);
        return res.json({
            message: "Success",
            data: forgotPasswordUser
        });
    } catch (error) {
        return res.status(error.status || 200).json({
            message: "Failed",
            error_key: error.error_key || "error_internal_server",
            error_message: error.error_message || error.message,
            error_data: error.error_data || {}
        });
    }
}

exports.changePassword = async(req, res) => {
    try {
        const { body } = req;
        if (!body.Old_Password || !body.New_Password) {
            return res.status(200).json({
                message: "Failed",
                error_key: "error_param",
                error_message: "Ketentuan Path Param / Query Param untuk Pemanggilan API tidak sesuai",
                error_data: {}
            });
        }
        const user = {
            ...req.userData,
            ...body
        }
        const changePasswordUser = await authorService.changePasswordUser(user);

        return res.json({
            message: "Success"
        });
    } catch (error) {
        return res.status(error.status || 200).json({
            message: "Failed",
            error_key: error.error_key || "error_internal_server",
            error_message: error.error_message || error.message,
            error_data: error.error_data || {}
        });
    }
}

exports.refreshToken = async(req, res) => {
    try {
        const { body } = req;
        if (!body.Refresh_Token) {
            return res.status(200).json({
                message: "Failed",
                error_key: "error_param",
                error_message: "Ketentuan Path Param / Query Param untuk Pemanggilan API tidak sesuai",
                error_data: {}
            });
        }
        
        const refreshTokenUser = await authorService.refreshToken(body.Refresh_Token);

        return res.json({
            message: "Success",
            data: refreshTokenUser
        });
    } catch (error) {
        return res.status(error.status || 200).json({
            message: "Failed",
            error_key: error.error_key || "error_internal_server",
            error_message: error.error_message || error.message,
            error_data: error.error_data || {}
        });
    }
}

exports.update = async(req, res) => {
    try {
        const { body } = req;
        if (!body.Name || !body.Pen_Name) {
            return res.status(200).json({
                message: "Failed",
                error_key: "error_param",
                error_message: "Ketentuan Path Param / Query Param untuk Pemanggilan API tidak sesuai",
                error_data: {}
            });
        }
        const user = {
            Author_ID : req.userData.Author_ID,
            Name: body.Name,
            Pen_Name: body.Pen_Name,
        }
        
        const updateUser = await authorService.updateUser(user);

        return res.json({
            message: "Success"
        });
    } catch (error) {
        return res.status(error.status || 200).json({
            message: "Failed",
            error_key: error.error_key || "error_internal_server",
            error_message: error.error_message || error.message,
            error_data: error.error_data || {}
        });
    }
}

exports.disableUser = async(req, res) => {
    try {
        // console.log(req.body)
        // const { body } = req;
        // if (!body.Refresh_Token) {
        //     return res.status(200).json({
        //         message: "Failed",
        //         error_key: "error_param",
        //         error_message: "Ketentuan Path Param / Query Param untuk Pemanggilan API tidak sesuai",
        //         error_data: {}
        //     });
        // }
        const user = {
            ...req.userData,            // ...req.body
        }
        
        const updateUser = await authorService.disableUser(user);

        return res.json({
            message: "Success"
        });
    } catch (error) {
        return res.status(error.status || 200).json({
            message: "Failed",
            error_key: error.error_key || "error_internal_server",
            error_message: error.error_message || error.message,
            error_data: error.error_data || {}
        });
    }
}

exports.getMyProfile = async(req, res) => {
    try {
        const dataMyProfile = await authorService.getMyProfile(req.userData);

        return res.json({
            message: "Success",
            data: dataMyProfile
        });
    } catch (error) {
        return res.status(error.status || 200).json({
            message: "Failed",
            error_key: error.error_key || "error_internal_server",
            error_message: error.error_message || error.message,
            error_data: error.error_data || {}
        });
    }
}

