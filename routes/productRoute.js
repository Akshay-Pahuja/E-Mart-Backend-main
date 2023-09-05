const express = require("express");
const { createProduct, getaProduct, getAllProduct, updateProduct, deleteProduct, addToWishlist,rating } = require("../controller/productCtrl");
const {isAdmin, authMiddleware} = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/createProduct",authMiddleware,isAdmin, createProduct);
// router.put(
//     "/upload/",
//     authMiddleware,
//     isAdmin,
//     uploadPhoto.array("images", 10),
//     productImgResize,
//     uploadImages
//   );
router.get("/getproduct/:id",getaProduct);
router.get("/getallProducts",getAllProduct)
router.put("/admin/updateProduct/:id",authMiddleware,isAdmin, updateProduct);
router.delete("/admin/deleteProduct/:id",authMiddleware,isAdmin, deleteProduct);
router.put("/wishlist",authMiddleware,addToWishlist);
router.put("/rating",authMiddleware,rating);
module.exports = router;