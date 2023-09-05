const express = require("express");
const { createCoupon, getAllCoupons, updateCoupon, deleteCoupon,getCoupon } = require("../controller/couponCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/createcoupon",authMiddleware,isAdmin,createCoupon);
router.get("/getallcoupons",authMiddleware,getAllCoupons);
router.put("/updatecoupon/:id",authMiddleware,isAdmin,updateCoupon);
router.delete("/deletecoupon/:id",authMiddleware,isAdmin,deleteCoupon);
router.get("/get-a-coupon/:id",authMiddleware,isAdmin,getCoupon);

module.exports = router;