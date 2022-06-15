const express = require("express");

const router = express.Router();

const salesController = require('../controllers/salesController')

const checkAuth = require('../middleware/checkAuth');

router.post("/add", salesController.add)
router.use(checkAuth)
router.get("/get_my_sales", salesController.getMySales)
router.get("/get/:id", salesController.getDetails)


module.exports = router;
