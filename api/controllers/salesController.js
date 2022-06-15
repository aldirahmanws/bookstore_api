const salesService = require("../service/salesService");

exports.add = async (req, res) => {
    try {
        const {body} = req
        if (!body.Name || !body.Email || !body.Quantity || !body.Book_ID ) {
            return res.status(200).json({
                message: "Failed",
                error_key: "error_param",
                error_message: "Ketentuan Path Param / Query Param untuk Pemanggilan API tidak sesuai",
                error_data: {}
            });
        }
        const addSales = await salesService.addSales(body);
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

exports.getMySales = async (req, res) => {
    try {
        const {query} = req
        if (!query.Page || !query.Limit ) {
            return res.status(200).json({
                message: "Failed",
                error_key: "error_param",
                error_message: "Ketentuan Path Param / Query Param untuk Pemanggilan API tidak sesuai",
                error_data: {}
            });
        }
        
        const resultGetMyBook = await salesService.getMySales(query, req.userData.Author_ID);
        return res.json({
            message: "Success",
            data: resultGetMyBook
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

exports.getDetails = async (req, res) => {
    try {
        const {params} = req
        if (!params.id ) {
            return res.status(200).json({
                message: "Failed",
                error_key: "error_param",
                error_message: "Ketentuan Path Param / Query Param untuk Pemanggilan API tidak sesuai",
                error_data: {}
            });
        }
        
        const detailsSales = await salesService.detailsSales(params.id);
        return res.json({
            message: "Success",
            data: detailsSales
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