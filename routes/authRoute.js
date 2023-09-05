const express = require("express");
const { createUser,loginUserCtrl, getallUser, getaUser, deleteaUser, updateaUser, blockUser, unblockUser, handleRefreshToken, logout, updatePassword,forgotPasswordToken, resetPassword, loginAdmin, getWishlist, saveAddress, userCart, getUserCart, emptyCart, applyCoupon, createOrder,getallOrders, updateOrderStatus,removeProductFromCart, updateProdQuantityFromCart, getMyOrders, getMonthWiseOrderIncome, getMonthWiseOrderCount, getYearlyTotalOrders, updateOrder } = require("../controller/userCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const { checkout, paymentVerification } = require("../controller/paymentCtrl");

const router = express.Router();

router.post("/register",createUser);
router.post("/forgot-password-token", forgotPasswordToken);
router.post("/cart",authMiddleware,userCart);
router.put("/reset-password/:token",resetPassword)
router.post("/login",loginUserCtrl);
router.post("/admin-login",loginAdmin);
router.post("/cart/applycoupon",authMiddleware,applyCoupon);
router.post("/create-order",authMiddleware, createOrder);
router.post("/order/checkout",authMiddleware,checkout);
router.post("/order/paymentVerification",authMiddleware,paymentVerification);
router.get("/admin/users",authMiddleware,isAdmin, getallUser);
router.get("/admin/user/:id",authMiddleware,isAdmin, getaUser);
router.get("/wishlist",authMiddleware,getWishlist);
router.get("/getmyorders",authMiddleware,getMyOrders);
router.get("/getallOrders",authMiddleware,isAdmin,getallOrders);
router.put("/updateOrder/:id",authMiddleware,isAdmin,updateOrder)
router.get("/getMonthWiseOrderIncome",authMiddleware,getMonthWiseOrderIncome);
router.get("/getYearlyTotalOrders",authMiddleware,getYearlyTotalOrders);
router.delete("/admin/delete/:id",deleteaUser);
router.delete("/empty-cart",authMiddleware,emptyCart);
router.delete("/delete-product-cart/:cartItemId",authMiddleware,removeProductFromCart);
router.delete("/update-product-cart/:cartItemId/:newQuantity",authMiddleware,updateProdQuantityFromCart);
router.put("/me/update",authMiddleware, updateaUser);
router.put("/admin/block-user/:id",authMiddleware,isAdmin,blockUser);
router.put("/admin/unblock-user/:id",authMiddleware,isAdmin,unblockUser);
router.get("/refreshtoken",handleRefreshToken);
router.get("/logout",logout);
router.put("/updatePassword",authMiddleware, updatePassword);
router.put("/save-address",authMiddleware,saveAddress)
router.put("/admin/update-order-status/:id",authMiddleware,isAdmin,updateOrderStatus);
router.get("/get-cart",authMiddleware ,getUserCart)

module.exports = router;