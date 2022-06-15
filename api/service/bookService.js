const fs = require("fs");

const randomString = require("../helpers/randomString");
const db = require("../config/database");

exports.getBook = async (dataQuery) => {
    try {
        const currentPage = parseInt(dataQuery.Page)
        const limit = parseInt(dataQuery.Limit)
        const offset = currentPage ? (currentPage - 1) * limit : 0;
        const title = dataQuery.Title ? dataQuery.Title : ""
        const author_id = dataQuery.Author_ID ? parseInt(dataQuery.Author_ID) : ""
        
        var additional = ""
        if(author_id != ""){
            additional = `and book."Author_ID" = ${author_id}`
        }
        
        const allBook = await db.query(`SELECT count(*) FROM public."Book" book INNER JOIN public."Author" author ON author."Author_ID" = book."Author_ID" WHERE author."Is_Disabled" = false and book."Title" LIKE '%${title}%' ${additional} `)
        const totalAllBook = parseInt(allBook.rows[0].count)
        const maxPage = Math.ceil(totalAllBook / limit)
        
        const book = await db.query(`SELECT book.*, author."Pen_Name" FROM public."Book" book INNER JOIN public."Author" author ON author."Author_ID" = book."Author_ID" WHERE author."Is_Disabled" = false and book."Title" LIKE '%${title}%' ${additional} LIMIT ${limit} OFFSET ${offset} `)

        const listData = []
        for (const itemBook of book.rows) {
            listData.push({
                Book_ID: itemBook.Book_ID,
                Author_ID: itemBook.Author_ID,
                Title: itemBook.Title,
                Summary: itemBook.Summary,
                Price: itemBook.Price,
                Stock: itemBook.Stock,
                Cover_URL: `${process.env.BASE_URL}/${itemBook.Cover_URL}`,
                Author_Pen_Name: itemBook.Pen_Name
            })    
        }
        const response = {
            List_Data: listData,
            Pagination_Data: {
                Current_Page : currentPage,
                Max_Data_Per_Page : limit,
                Max_Page : (maxPage > 0) ? maxPage : 1,
                Total_All_Data : totalAllBook
            }
        }

        return response;
    } catch (error) {
        throw {
            status: error.status || 200,
            message: error.message || "Failed",
            error_key: error.error_key || "error_internal_server",
            error_message: error.error_message || error.message,
            error_data: error.error_data || {},
        };
    }
};
exports.getMyBook = async (dataQuery, Author_ID) => {
    try {
        const currentPage = parseInt(dataQuery.Page)
        const limit = parseInt(dataQuery.Limit)
        const offset = currentPage ? (currentPage - 1) * limit : 0;
        const title = dataQuery.Title ? dataQuery.Title : ""

        const allBook = await db.query(`SELECT count(*) FROM public."Book" book INNER JOIN public."Author" author ON author."Author_ID" = book."Author_ID" WHERE book."Author_ID" = ${Author_ID} and book."Title" LIKE '%${title}%' `)
        const totalAllBook = parseInt(allBook.rows[0].count)
        const maxPage = Math.ceil(totalAllBook / limit)
        
        const book = await db.query(`SELECT book.*, author."Pen_Name" FROM public."Book" book INNER JOIN public."Author" author ON author."Author_ID" = book."Author_ID" WHERE book."Author_ID" = ${Author_ID} and book."Title" LIKE '%${title}%' LIMIT ${limit} OFFSET ${offset} `)

        const listData = []
        for (const itemBook of book.rows) {
            listData.push({
                Book_ID: itemBook.Book_ID,
                Author_ID: itemBook.Author_ID,
                Title: itemBook.Title,
                Summary: itemBook.Summary,
                Price: itemBook.Price,
                Stock: itemBook.Stock,
                Cover_URL: `${process.env.BASE_URL}/${itemBook.Cover_URL}`,
                Author_Pen_Name: itemBook.Pen_Name
            })    
        }
        const response = {
            List_Data: listData,
            Pagination_Data: {
                Current_Page : currentPage,
                Max_Data_Per_Page : limit,
                Max_Page : (maxPage > 0) ? maxPage : 1,
                Total_All_Data : totalAllBook
            }
        }

        return response;
    } catch (error) {
        throw {
            status: error.status || 200,
            message: error.message || "Failed",
            error_key: error.error_key || "error_internal_server",
            error_message: error.error_message || error.message,
            error_data: error.error_data || {},
        };
    }
};
exports.detailsBook = async (Book_ID) => {
    try {
        const book = await db.query(`SELECT *, author."Pen_Name" FROM public."Book" book INNER JOIN public."Author" author ON author."Author_ID" = book."Author_ID" where book."Book_ID" = '${Book_ID}' `)
        if(book.rowCount == 0){
            throw {
                status: 200,
                message: "Failed",
                error_key: "error_id_not_found",
                error_message: "ID tidak ditemukan di db",
                error_data: {},
            };
        }
        const response = {
            Book_ID: book.rows[0].Book_ID,
            Author_ID: book.rows[0].Author_ID,
            Title: book.rows[0].Title,
            Summary: book.rows[0].Summary,
            Price: book.rows[0].Price,
            Stock: book.rows[0].Stock,
            Cover_URL: `${process.env.BASE_URL}/${book.rows[0].Cover_URL}`,
            Author_Pen_Name: book.rows[0].Pen_Name
        }

        return response;
    } catch (error) {
        throw {
            status: error.status || 200,
            message: error.message || "Failed",
            error_key: error.error_key || "error_internal_server",
            error_message: error.error_message || error.message,
            error_data: error.error_data || {},
        };
    }
};
exports.createNewBook = async (newBook) => {
    try {
        const author = await db.query(`SELECT * FROM public."Author" where "Author_ID" = ${newBook.User.Author_ID}`)

        if(author.rowCount == 0){
            throw {
                status: 200,
                message: "Failed",
                error_key: "error_internal_server",
                error_message: "Author ID tidak di temukan",
                error_data: {},
            };
        }

        var base64Data = newBook.Cover_Image_Base64.replace(
            `data:image/${newBook.Image_Extension};base64,`,
            ""
        );
        const fileName = `uploads/${randomString(30)}.${newBook.Image_Extension}`
        
        fs.writeFile(
            fileName,
            base64Data,
            "base64",
            function (err) {
                if (err) {
                    throw {
                        status: 200,
                        message: "Failed",
                        error_key: "error_internal_server",
                        error_message: err.message,
                        error_data: {},
                    };
                }
            }
        );

        let insertQuery = `INSERT INTO public."Book"(
            "Title", "Author_ID", "Summary", "Stock", "Price", "Cover_URL")
            VALUES ('${newBook.Title}', '${newBook.User.Author_ID}', '${newBook.Summary}', ${newBook.Stock}, ${newBook.Price}, '${fileName}');`;

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

        return true;
    } catch (error) {
        throw {
            status: error.status || 200,
            message: error.message || "Failed",
            error_key: error.error_key || "error_internal_server",
            error_message: error.error_message || error.message,
            error_data: error.error_data || {},
        };
    }
};

exports.updateBook = async (dataBook) => {
    try {
        const resultUpdateBook = await db.query(`UPDATE public."Book" set "Title" = '${dataBook.Title}', "Summary" = '${dataBook.Summary}', "Price" = ${dataBook.Price}, "Stock" = ${dataBook.Stock} where "Book_ID" = ${dataBook.Book_ID}`)
        if (!resultUpdateBook) {
            throw {
                status: 200,
                message: "Failed",
                error_key: "error_internal_server",
                error_message: resultUpdateBook.message,
                error_data: {},
            };
        }
        

        return true;
    } catch (error) {
        throw {
            status: error.status || 200,
            message: error.message || "Failed",
            error_key: error.error_key || "error_internal_server",
            error_message: error.error_message || error.message,
            error_data: error.error_data || {},
        };
    }
};

exports.updateCoverBook = async (dataBook) => {
    try {
        const book = await db.query(`SELECT * FROM public."Book" where "Book_ID" = '${dataBook.Book_ID}'`)
        if(book.rowCount == 0){
            throw {
                status: 200,
                message: "Failed",
                error_key: "error_id_not_found",
                error_message: "ID tidak ditemukan di db",
                error_data: {},
            };
        }

        var base64Data = dataBook.Cover_Image_Base64.replace(
            `data:image/${dataBook.Image_Extension};base64,`,
            ""
        );
        const fileName = `uploads/${randomString(30)}.${dataBook.Image_Extension}`
        
        fs.writeFile(
            fileName,
            base64Data,
            "base64",
            function (err) {
                if (err) {
                    throw {
                        status: 200,
                        message: "Failed",
                        error_key: "error_internal_server",
                        error_message: err.message,
                        error_data: {},
                    };
                }
            }
        );
        
        const resultUpdateCoverBook = await db.query(`UPDATE public."Book" set "Cover_URL" = '${fileName}' where "Book_ID" = ${dataBook.Book_ID}`)
        if (!resultUpdateCoverBook) {
            throw {
                status: 200,
                message: "Failed",
                error_key: "error_internal_server",
                error_message: resultUpdateCoverBook.message,
                error_data: {},
            };
        }
        if (fs.existsSync(book.rows[0].Cover_URL)) fs.unlinkSync(book.rows[0].Cover_URL);

        return true;
    } catch (error) {
        throw {
            status: error.status || 200,
            message: error.message || "Failed",
            error_key: error.error_key || "error_internal_server",
            error_message: error.error_message || error.message,
            error_data: error.error_data || {},
        };
    }
};

exports.deleteBook = async (Book_ID) => {
    try {
        const book = await db.query(`SELECT * FROM public."Book" where "Book_ID" = '${Book_ID}'`)
        if(book.rowCount == 0){
            throw {
                status: 200,
                message: "Failed",
                error_key: "error_id_not_found",
                error_message: "ID tidak ditemukan di db",
                error_data: {},
            };
        }
        if (fs.existsSync(book.rows[0].Cover_URL)) fs.unlinkSync(book.rows[0].Cover_URL);

        const resultDeletedBook = await db.query(`DELETE from public."Book" where "Book_ID" = '${Book_ID}'`)
        if (!resultDeletedBook) {
            throw {
                status: 200,
                message: "Failed",
                error_key: "error_internal_server",
                error_message: resultDeletedBook.message,
                error_data: {},
            };
        }

        return true;
    } catch (error) {
        throw {
            status: error.status || 200,
            message: error.message || "Failed",
            error_key: error.error_key || "error_internal_server",
            error_message: error.error_message || error.message,
            error_data: error.error_data || {},
        };
    }
};
