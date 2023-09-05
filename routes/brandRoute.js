const express = require("express");
const {
  createBrand,
  updateBrand,
  deleteBrand,
  getBrand,
  getallBrand,
} = require("../controller/brandCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/createbrand", authMiddleware, isAdmin, createBrand);
router.put("/updatebrand/:id", authMiddleware, isAdmin, updateBrand);
router.delete("/deletebrand/:id", authMiddleware, isAdmin, deleteBrand);
router.get("/get-a-brand/:id", getBrand);
router.get("/getallbrands", getallBrand);

module.exports = router;