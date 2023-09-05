const express = require("express");
const {
  createEnquiry,
  updateEnquiry,
  deleteEnquiry,
  getEnquiry,
  getallEnquiry,
} = require("../controller/enqCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/createEnquiry",  createEnquiry);
router.put("/updateEnquiry/:id", authMiddleware, isAdmin, updateEnquiry);
router.delete("/deleteEnquiry/:id", authMiddleware, isAdmin, deleteEnquiry);
router.get("/get-a-Enquiry/:id", getEnquiry);
router.get("/getallEnquirys", getallEnquiry);

module.exports = router;