const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const changeURL = async (url, folder) => {
  const newURL = await cloudinary.uploader.upload(url, {
    upload_preset: "ehliyet",
    folder: folder,
  });
  return newURL.url + "," + newURL.height + "," + newURL.width;
};

module.exports = changeURL;
