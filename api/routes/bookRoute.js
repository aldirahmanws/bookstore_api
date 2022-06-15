const express = require("express");

const router = express.Router();

const bookController = require('../controllers/bookController')

const checkAuth = require('../middleware/checkAuth');

router.get("/get", bookController.get)
router.get("/get/:id", bookController.getDetails)

router.use(checkAuth)
router.get("/get_my_book", bookController.getMyBook)
router.post("/add", bookController.addBook)
router.put("/update/:id", bookController.updateBook)
router.put("/update_cover/:id", bookController.updateCoverBook)
router.delete("/delete/:id", bookController.deleteBook)

module.exports = router;
