const express = require("express");
const {
  createColor,
  updateColor,
  deleteColor,
  getColor,
  getallColor,
} = require("../controller/colorCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/createColor", authMiddleware, isAdmin, createColor);
router.put("/updateColor/:id", authMiddleware, isAdmin, updateColor);
router.delete("/deleteColor/:id", authMiddleware, isAdmin, deleteColor);
router.get("/get-a-Color/:id", getColor);
router.get("/getallColors", getallColor);

module.exports = router;