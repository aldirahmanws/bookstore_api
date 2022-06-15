const express = require("express");

router = express.Router();

const authorRoute = require('./authorRoute') 
const bookRoute = require('./bookRoute') 
const salesRoute = require('./salesRoute') 

router.use("/author", authorRoute);
router.use("/book", bookRoute);
router.use("/sales", salesRoute);

module.exports = router;
