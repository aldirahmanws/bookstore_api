const express = require("express");

const router = express.Router();

const authorController = require('../controllers/authorController')

const checkAuth = require('../middleware/checkAuth');

router.post("/register", authorController.register)
router.post("/login", authorController.login)
router.post("/forgot_password", authorController.forgotPassword)
router.post("/refresh_token", authorController.refreshToken)

router.use(checkAuth)
router.post("/logout", authorController.logout)
router.put("/change_password", authorController.changePassword)
router.put("/update", authorController.update)
router.delete("/delete", authorController.disableUser)
router.get("/get_my_profile", authorController.getMyProfile)

module.exports = router;
