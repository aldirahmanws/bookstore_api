const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const db = require("../config/database");

function randomString(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}

exports.createNewUser = async (newUser) => {
    try {
        const isAlreadyAdded = await db.query(
            `SELECT COUNT(*) FROM public."Author" where "Email" = '${newUser.Email}'`
        );

        if (parseInt(isAlreadyAdded.rows[0].count) > 0) {

            throw {
                status: 200,
                message: "Failed",
                error_key: "error_email_duplicate",
                error_message: "Error Duplicate",
                error_data: {},
            };
        }
        
        newUser.Password = await bcrypt.hash(newUser.Password, 10);

        let insertQuery = `INSERT INTO public."Author"(
	        "Name", "Pen_Name", "Email", "Password")
	        VALUES ('${newUser.Name}', '${newUser.Pen_Name}', '${newUser.Email}', '${newUser.Password}');`;
            
        const result = await db.query(insertQuery);
        if (!result) {
            throw {
                status: 200,
                message: "Failed",
                error_key: "error_internal_server",
                error_message: result.message,
                error_data: {},
            };
        }

        return newUser;
    } catch (error) {
        throw {
            status: error.status || 200,
            message: error.message ||"Failed",
            error_key: error.error_key || "error_internal_server",
            error_message: error.error_message || error.message,
            error_data: error.error_data || {},
        };
    }
};

exports.loginUser = async (dataUser) => {
    try {
        const user = await db.query(`SELECT * FROM public."Author" where "Email" = '${dataUser.Email}'`)
        if(user.rowCount == 0){
            throw {
                status: 200,
                message: "Failed",
                error_key: "error_email_not_found",
                error_message: "Email tidak ditemukan di data Author",
                error_data: {},
            };
        }

        var checkPassword = await bcrypt.compare(
            dataUser.Password,
            user.rows[0].Password
        );
        if (!checkPassword) {
            throw {
                status: 200,
                message: "Failed",
                error_key: "error_invalid_password",
                error_message: "Password tidak sesuai",
                error_data: {},
            };
        }
        if(user.rows[0].Is_Disabled == true){
            throw {
                status: 200,
                message: "Failed",
                error_key: "error_internal_server",
                error_message: "Account Disabled",
                error_data: {},
            };
        }
        const accessToken = await jwt.sign(
            {
                Author_ID: user.rows[0].Author_ID,
                Name: user.rows[0].Name,
                Pen_Name: user.rows[0].Pen_Name,
                Email: user.rows[0].Email
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: "15m",
            }
        );
        const refreshToken = await jwt.sign(
            {
                Author_ID: user.rows[0].Author_ID,
                Name: user.rows[0].Name,
                Pen_Name: user.rows[0].Pen_Name,
                Email: user.rows[0].Email
            },
            process.env.REFRESH_TOKEN_SECRET,
            {
                expiresIn: "1d",
            }
        );

        let insertRefreshToken = `INSERT INTO public."Token"(
	        "Refresh_Token")
	        VALUES ('${refreshToken}');`;
            
        const resultInsertRefreshToken = await db.query(insertRefreshToken);
        if (!resultInsertRefreshToken) {
            throw {
                status: 200,
                message: "Failed",
                error_key: "error_internal_server",
                error_message: resultInsertRefreshToken.message,
                error_data: {},
            };
        }
        const responseLogin = {
            Refresh_Token: refreshToken,
            Access_Token: accessToken
        };
        return responseLogin;
    } catch (error) {
        throw {
            status: error.status || 200,
            message: "Failed",
            error_key: error.error_key || "error_internal_server",
            error_message: error.error_message || error.message,
            error_data: error.error_data || {},
        };
    }
};

exports.forgotPasswordUser = async (email) => {
    try {
        const password = randomString(10)
        const newPassword = await bcrypt.hash(password, 10);
        const user = await db.query(`SELECT * FROM public."Author" where "Email" = '${email}'`)
        if(user.rowCount == 0){
            throw {
                status: 200,
                message: "Failed",
                error_key: "error_email_not_found",
                error_message: "Email tidak ditemukan di data Author",
                error_data: {},
            };
        }

        const updateUser = await db.query(`UPDATE public."Author" set "Password" = '${newPassword}' where "Email" = '${email}'`)
        if (!updateUser) {
            throw {
                status: 200,
                message: "Failed",
                error_key: "error_internal_server",
                error_message: resultInsertRefreshToken.message,
                error_data: {},
            };
        }
            
        const responseForgotPassword = {
            New_Password: password
        };

        return responseForgotPassword;
    } catch (error) {
        throw {
            status: error.status || 200,
            message: "Failed",
            error_key: error.error_key || "error_internal_server",
            error_message: error.error_message || error.message,
            error_data: error.error_data || {},
        };
    }
};
exports.changePasswordUser = async (dataUser) => {
    try {
        const user = await db.query(`SELECT * FROM public."Author" where "Author_ID" = '${dataUser.Author_ID}'`)
        if(user.rowCount == 0){
            throw {
                status: 200,
                message: "Failed",
                error_key: "error_author_id_not_found",
                error_message: "Author ID tidak di temukan",
                error_data: {},
            };
        }
        var checkPassword = await bcrypt.compare(
            dataUser.Old_Password,
            user.rows[0].Password
        );
        if (!checkPassword) {
            throw {
                status: 200,
                message: "Failed",
                error_key: "error_invalid_password",
                error_message: "Password tidak sesuai",
                error_data: {},
            };
        }
        const newPassword = await bcrypt.hash(dataUser.New_Password, 10);
        const updatePasswordUser = await db.query(`UPDATE public."Author" set "Password" = '${newPassword}' where "Author_ID" = '${dataUser.Author_ID}'`)
        if (!updatePasswordUser) {
            throw {
                status: 200,
                message: "Failed",
                error_key: "error_internal_server",
                error_message: updatePasswordUser.message,
                error_data: {},
            };
        }
        
        return true;
    } catch (error) {
        throw {
            status: error.status || 200,
            message: "Failed",
            error_key: error.error_key || "error_internal_server",
            error_message: error.error_message || error.message,
            error_data: error.error_data || {},
        };
    }
};
exports.refreshToken = async (refresh_token) => {
    try {
        const token = await db.query(`SELECT * FROM public."Token" where "Refresh_Token" = '${refresh_token}'`)
        
        if(token.rowCount == 0){
            throw {
                status: 200,
                message: "Failed",
                error_key: "error_refresh_token_invalid",
                error_message: "Refresh Token yang di supply tidak sesuai ketentuan / settingan token",
                error_data: {},
            };
        }
        const user = await jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET, (err, result) => {
            
            if(err){
                if (err.message == "jwt expired") {
                    throw {
                        message: "Failed",
                        error_key: "error_expired_token",
                        error_message: "Token access pada Header sudah kadaluarsa",
                        error_data: {},
                    }
                }
                throw {
                    message: "Failed",
                    error_key: "error_invalid_token",
                    error_message:
                        "Token access pada Header tidak sesuai ketentuan / settingan token",
                    error_data: {},
                }
            }

            return result
        })
        
        const accessToken = await jwt.sign(
            {
                Author_ID: user.Author_ID,
                Name: user.Name,
                Pen_Name: user.Pen_Name,
                Email: user.Email
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: "15m",
            }
        );
        const refreshToken = await jwt.sign(
            {
                Author_ID: user.Author_ID,
                Name: user.Name,
                Pen_Name: user.Pen_Name,
                Email: user.Email
            },
            process.env.REFRESH_TOKEN_SECRET,
            {
                expiresIn: "1d",
            }
        );

        let insertRefreshToken = `INSERT INTO public."Token"(
	        "Refresh_Token")
	        VALUES ('${refreshToken}');`;
            
        const resultInsertRefreshToken = await db.query(insertRefreshToken);
        if (!resultInsertRefreshToken) {
            throw {
                status: 200,
                message: "Failed",
                error_key: "error_internal_server",
                error_message: resultInsertRefreshToken.message,
                error_data: {},
            };
        }
        const responseLogin = {
            Access_Token: accessToken,
            Refresh_Token: refreshToken,
        };
        return responseLogin;
    } catch (error) {
        
        throw {
            status: error.status || 200,
            message: "Failed",
            error_key: error.error_key || "error_internal_server",
            error_message: error.error_message || error.message,
            error_data: error.error_data || {},
        };
    }
};

exports.updateUser = async (dataUser) => {
    try {
        const updateUser = await db.query(`UPDATE public."Author" set "Name" = '${dataUser.Name}', "Pen_Name" = '${dataUser.Pen_Name}' where "Author_ID" = '${dataUser.Author_ID}'`)
        if (!updateUser) {
            throw {
                status: 200,
                message: "Failed",
                error_key: "error_internal_server",
                error_message: updateUser.message,
                error_data: {},
            };
        }
        
        return true;
    } catch (error) {
        
        throw {
            status: error.status || 200,
            message: "Failed",
            error_key: error.error_key || "error_internal_server",
            error_message: error.error_message || error.message,
            error_data: error.error_data || {},
        };
    }
};

exports.disableUser = async (dataUser) => {
    try {
        const updateUser = await db.query(`UPDATE public."Author" set "Is_Disabled" = true where "Author_ID" = '${dataUser.Author_ID}'`)
        if (!updateUser) {
            throw {
                status: 200,
                message: "Failed",
                error_key: "error_internal_server",
                error_message: updateUser.message,
                error_data: {},
            };
        }
        // const deleteToken = await db.query(`Delete FROM public."Token" where "Refresh_Token"= '${dataUser.Refresh_Token}'`)
        // if (!deleteToken) {
        //     throw {
        //         status: 200,
        //         message: "Failed",
        //         error_key: "error_internal_server",
        //         error_message: deleteToken.message,
        //         error_data: {},
        //     };
        // }
        return true;
    } catch (error) {
        
        throw {
            status: error.status || 200,
            message: "Failed",
            error_key: error.error_key || "error_internal_server",
            error_message: error.error_message || error.message,
            error_data: error.error_data || {},
        };
    }
};
exports.getMyProfile = async (dataUser) => {
    try {
        
        const user = await db.query(`SELECT * FROM public."Author" where "Author_ID" = '${dataUser.Author_ID}'`)
        if(user.rowCount == 0){
            throw {
                status: 200,
                message: "Failed",
                error_key: "error_author_id_not_found",
                error_message: "Author ID tidak di temukan",
                error_data: {},
            };
        }
        const response = {
            Author_ID : user.rows[0].Author_ID,
            Name : user.rows[0].Name,
            Pen_Name : user.rows[0].Pen_Name,
            Email : user.rows[0].Email
        }
        return response;
    } catch (error) {
        
        throw {
            status: error.status || 200,
            message: "Failed",
            error_key: error.error_key || "error_internal_server",
            error_message: error.error_message || error.message,
            error_data: error.error_data || {},
        };
    }
};