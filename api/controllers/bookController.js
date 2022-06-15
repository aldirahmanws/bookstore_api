const bookService = require("../service/bookService");

exports.get = async (req, res) => {
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
        
        const getBook = await bookService.getBook(query);
        return res.json({
            message: "Success",
            data: getBook
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
        
        const detailsBook = await bookService.detailsBook(params.id);
        return res.json({
            message: "Success",
            data: detailsBook
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

exports.addBook = async (req, res) => {
    try {
        const {body} = req
        if (!body.Title || !body.Summary || !body.Price || !body.Stock || !body.Cover_Image_Base64 || !body.Image_Extension ) {
            return res.status(200).json({
                message: "Failed",
                error_key: "error_param",
                error_message: "Ketentuan Path Param / Query Param untuk Pemanggilan API tidak sesuai",
                error_data: {}
            });
        }
        
        const newBook = {
            Title: body.Title,
            Summary: body.Summary,
            Price: body.Price,
            Stock: body.Stock,
            Cover_Image_Base64: body.Cover_Image_Base64,
            Image_Extension: body.Image_Extension,
            User: req.userData
        }
        const createdBook = await bookService.createNewBook(newBook);
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

exports.updateBook = async (req, res) => {
    try {
        const {body, params} = req
        if (!body.Title || !body.Summary || !body.Price || !body.Stock || !params.id ) {
            return res.status(200).json({
                message: "Failed",
                error_key: "error_param",
                error_message: "Ketentuan Path Param / Query Param untuk Pemanggilan API tidak sesuai",
                error_data: {}
            });
        }
        
        const book = {
            Title: body.Title,
            Summary: body.Summary,
            Price: body.Price,
            Stock: body.Stock,
            Book_ID: params.id
        }
        const updatedBook = await bookService.updateBook(book);
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

exports.updateCoverBook = async (req, res) => {
    try {
        console.log(1123)
        const {body, params} = req
        console.log(body)
        
        if (!body.Cover_Image_Base64 || !body.Image_Extension|| !params.id ) {
            return res.status(200).json({
                message: "Failed",
                error_key: "error_param",
                error_message: "Ketentuan Path Param / Query Param untuk Pemanggilan API tidak sesuai",
                error_data: {}
            });
        }
        
        const book = {
            Cover_Image_Base64: body.Cover_Image_Base64,
            Image_Extension: body.Image_Extension,
            Book_ID: params.id
        }
        const updatedBook = await bookService.updateCoverBook(book);
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

exports.deleteBook = async (req, res) => {
    try {
        
        const { params } = req;
        if (!params.id) {
            return res.status(200).json({
                message: "Failed",
                error_key: "error_param",
                error_message: "Ketentuan Path Param / Query Param untuk Pemanggilan API tidak sesuai",
                error_data: {}
            });
        }
        
        const deleteBook = await bookService.deleteBook(params.id);

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


exports.getMyBook = async (req, res) => {
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
        
        const resultGetMyBook = await bookService.getMyBook(query, req.userData.Author_ID);
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