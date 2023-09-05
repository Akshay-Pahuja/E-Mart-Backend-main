const cloudinary = require("cloudinary");


cloudinary.config({ 
    cloud_name: "djnkhevus", 
    api_key: '618126968382126', 
    api_secret: "rHU9NLiX1dd0w4gpmuWyWjcUJ0Q"
  });

  exports.cloudinaryUploadImg = async(fileToUploads)=>{
    return new Promise((resolve) => {
        cloudinary.uploader.upload(fileToUploads,(result)=>{
            resolve(
                {
                    url: result.secure_url,
                    asset_id: result.asset_id,
                    public_id: result.public_id,
                 },
                 {
                     resource_type:"auto",
                 }
            )
        })
    })
  };

  exports.cloudinaryDeleteImg = async (fileToDelete) => {
    return new Promise((resolve) => {
      cloudinary.uploader.destroy(fileToDelete, (result) => {
        resolve(
          {
            url: result.secure_url,
            asset_id: result.asset_id,
            public_id: result.public_id,
          },
          {
            resource_type: "auto",
          }
        );
      });
    });
  };

