const fs = require("fs");
const asyncHandler = require("express-async-handler");

const {
  cloudinaryUploadImg,
  cloudinaryDeleteImg,
} = require("../utils/cloudinary");
const uploadImages = asyncHandler(async (req, res) => {
  try {
    const uploader = (path) => cloudinaryUploadImg(path, "images");
    const urls = [];
    const files = req.files;
    for (const file of files) {
      const { path } = file;
      const newpath = await uploader(path);
      console.log(newpath);
      urls.push(newpath);
      fs.unlinkSync(path);
    }
    const images = urls.map((file) => {
      return file;
    });
    res.json(images);
  } catch (error) {
    throw new Error(error);
  }
});
const deleteImages = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = cloudinaryDeleteImg(id, "images");
    res.json({ message: "Deleted" });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  uploadImages,
  deleteImages,
};

// const fs = require("fs");
// const asyncHandler = require("express-async-handler");
// const {
//   cloudinaryUploadImg,
//   cloudinaryDeleteImg,
// } = require("../utils/cloudinary");

// const uploadImages = asyncHandler(async (req, res) => {
//   try {
//     const uploader = async (path) => {
//       const newpath = await cloudinaryUploadImg(path, "images");
//       console.log(newpath);
//       return newpath;
//     };

//     const urls = [];

//     const files = req.files;
   
//     for (const file of files) {
//       const { path } = file;
//       const newpath = await uploader(path);
//       console.log(newpath)
//       urls.push(newpath);
//       fs.unlinkSync(path);
      
//     }

//     res.json(urls);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Failed to upload images" });
//   }
// });

// const deleteImages = asyncHandler(async (req, res) => {
//   try {
//     const { id } = req.params;
//     await cloudinaryDeleteImg(id, "images");
//     res.json({ message: "Deleted" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Failed to delete image" });
//   }
// });

// module.exports = {
//   uploadImages,
//   deleteImages,
// };
