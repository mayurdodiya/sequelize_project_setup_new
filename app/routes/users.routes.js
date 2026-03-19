const express = require("express");
const controller = require("../controller/users/users.controller.js");
const validation = require("../validation/userValidation.js");
const router = express.Router();
const validate = require("../middlewares/validate");
const { auth } = require("../middlewares/auth");
const enums = require("../services/enums.js");

// login
router.post("/login", validate(validation.login), controller.login);

// add User
router.post("/", validate(validation.register), controller.register);

// update
router.put("/:id", validate(validation.updateUser), controller.updateById);

// delete
router.delete("/:id", validate(validation.userIdParam), controller.deleteById);

// view All
router.get("/", auth({ usersAllowed: [enums.ROLE.ADMIN, enums.ROLE.USER] }), validate(validation.viewAllUsers), controller.viewAll);

// view By ID
router.get("/:id", auth({ usersAllowed: [enums.ROLE.ADMIN, enums.ROLE.USER] }), validate(validation.userIdParam), controller.viewById);

module.exports = router;
