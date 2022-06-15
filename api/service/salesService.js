const db = require("../config/database");

exports.addSales = async (newSales) => {
    try {
        const book = await db.query(
            `SELECT * FROM public."Book" where "Book_ID" = '${newSales.Book_ID}'`
        );

        if (book.rowCount == 0) {
            throw {
                status: 200,
                message: "Failed",
                error_key: "error_internal_server",
                error_message: "Book not found",
                error_data: {},
            };
        }
        if (book.rows[0].Stock < newSales.Quantity) {
            throw {
                status: 200,
                message: "Failed",
                error_key: "error_internal_server",
                error_message: "Insufficient stock of books",
                error_data: {},
            };
        }

        const priceTotal = newSales.Quantity * book.rows[0].Price;
        let insertQuery = `INSERT INTO public."Sales"(
	        "Recipient_Name", "Recipient_Email", "Book_Title", "Author_ID", "Quantity", "Price_Per_Unit", "Price_Total")
	        VALUES ('${newSales.Name}', '${newSales.Email}', '${book.rows[0].Title}', ${book.rows[0].Author_ID}, ${newSales.Quantity}, ${book.rows[0].Price}, ${priceTotal});`;

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
        const stock = book.rows[0].Stock - newSales.Quantity;
        const updateBook = await db.query(
            `UPDATE public."Book" set "Stock" = '${stock}' where "Book_ID" = '${newSales.Book_ID}'`
        );
        if (!updateBook) {
            throw {
                status: 200,
                message: "Failed",
                error_key: "error_internal_server",
                error_message: updateBook.message,
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

exports.getMySales = async (dataQuery, Author_ID) => {
    try {
        const currentPage = parseInt(dataQuery.Page);
        const limit = parseInt(dataQuery.Limit);
        const offset = currentPage ? (currentPage - 1) * limit : 0;
        const title = dataQuery.Book_Title ? dataQuery.Book_Title : "";

        var additional = "";
        if (
            dataQuery.Created_Time_Start !== undefined &&
            dataQuery.Created_Time_Start != ""
        ) {
            additional += ` and sales."Created_Time" >= to_timestamp(${dataQuery.Created_Time_Start})`;
        }
        if (
            dataQuery.Created_Time_End !== undefined &&
            dataQuery.Created_Time_End != ""
        ) {
            additional += ` and sales."Created_Time" <= to_timestamp(${dataQuery.Created_Time_End})`;
        }

        const allSales = await db.query(
            `SELECT count(*) FROM public."Sales" sales WHERE sales."Author_ID" = ${Author_ID} and sales."Book_Title" LIKE '%${title}%' ${additional} `
        );
        const totalAllSales = parseInt(allSales.rows[0].count);
        const maxPage = Math.ceil(totalAllSales / limit);

        const sales = await db.query(
            `SELECT *, extract(epoch from sales."Created_Time" at time zone 'utc' at time zone 'utc') as "Unix_Time"  FROM public."Sales" sales WHERE sales."Author_ID" = ${Author_ID} and sales."Book_Title" LIKE '%${title}%' ${additional} LIMIT ${limit} OFFSET ${offset} `
        );

        const listData = [];
        for (const itemSales of sales.rows) {
            listData.push({
                Sales_ID: itemSales.Sales_ID,
                Recipient_Name: itemSales.Recipient_Name,
                Recipient_Email: itemSales.Recipient_Email,
                Book_Title: itemSales.Book_Title,
                Author_ID: itemSales.Author_ID,
                Quantity: itemSales.Quantity,
                Price_Per_Unit: itemSales.Price_Per_Unit,
                Total_Price: itemSales.Price_Total,
                Created_Time: itemSales.Unix_Time,
            });
        }
        const response = {
            List_Data: listData,
            Pagination_Data: {
                Current_Page: currentPage,
                Max_Data_Per_Page: limit,
                Max_Page: maxPage > 0 ? maxPage : 1,
                Total_All_Data: totalAllSales,
            },
        };

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

exports.detailsSales = async (Sales_ID) => {
    try {
        const sales = await db.query(
            `SELECT *, extract(epoch from sales."Created_Time" at time zone 'utc' at time zone 'utc') as "Unix_Time" FROM public."Sales" sales where sales."Sales_ID" = '${Sales_ID}'`
        );
        if (sales.rowCount == 0) {
            throw {
                status: 200,
                message: "Failed",
                error_key: "error_id_not_found",
                error_message: "ID tidak ditemukan di db",
                error_data: {},
            };
        }
        const response = {
            Sales_ID: sales.rows[0].Sales_ID,
            Recipient_Name: sales.rows[0].Recipient_Name,
            Recipient_Email: sales.rows[0].Recipient_Email,
            Book_Title: sales.rows[0].Book_Title,
            Author_ID: sales.rows[0].Author_ID,
            Quantity: sales.rows[0].Quantity,
            Price_Per_Unit: sales.rows[0].Price_Per_Unit,
            Total_Price: sales.rows[0].Price_Total,
            Created_Time: sales.rows[0].Unix_Time,
        };

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
