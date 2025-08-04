const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");
const { verifyToken, isAdmin } = require("../middleware/auth.middleware");

// Admin-only routes
router.post("/", [verifyToken, isAdmin], productController.create);
router.put("/:id", [verifyToken, isAdmin], productController.update);
router.delete("/:id", [verifyToken, isAdmin], productController.deleteProduct);

// Public routes
router.get("/", productController.findAll);
router.get("/:id", productController.findOne);

module.exports = router;
