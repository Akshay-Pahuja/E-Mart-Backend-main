const express = require("express");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const { createBlog, updateBlog, getBlog, getAllBlogs, deleteBlog, liketheBlog, disliketheBlog,uploadImages } = require("../controller/blogCtrl");
const {uploadPhoto,blogImgResize} = require("../middlewares/uploadImages")
const router = express.Router();

router.post("/createblog",authMiddleware,isAdmin,createBlog);
// router.put(
//     "/upload/:id",
//     authMiddleware,
//     isAdmin,
//     uploadPhoto.array("images", 10),
//     blogImgResize,
//     uploadImages
//   );
router.put("/like",authMiddleware,liketheBlog);
router.put("/dislike",authMiddleware,disliketheBlog);
router.put("/updateblog/:id",authMiddleware,isAdmin,updateBlog);
router.get("/getblog/:id",getBlog);
router.get("/getallblogs",getAllBlogs);
router.delete("/deleteblog/:id",authMiddleware,isAdmin, deleteBlog);

module.exports=router;