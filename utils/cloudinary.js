const cloudinary = require("cloudinary").v2;
const {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_API_KEY,
  CLOUDINARY_ROOT_FOLDER,
  NODE_ENV,
} = process.env;

const isProduction = NODE_ENV === "production";

// Only configure Cloudinary in production
if (isProduction) {
  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
  });
}

async function requireCoverImage(req, res) {
  if (!req.file)
    return res.status(400).send({
      status: false,
      message: "coverImage is Required",
      data: null,
    });
}

async function requireAudio(req, res) {
  if (!req.file)
    return res.status(400).send({
      status: false,
      message: "Episode Audio is Required",
      data: null,
    });
}

async function coverImageUpload(req, res) {
  requireCoverImage(req, res);

  // In development, use local file storage
  if (!isProduction) {
    const localUrl = `http://localhost:${process.env.PORT || 4000}/${req.file.path}`;
    req.body.coverImageUrl = localUrl;
    req.body.cloudinary = {
      public_id: req.file.filename,
      secure_url: localUrl,
      url: localUrl,
    };
    return { secure_url: localUrl, public_id: req.file.filename };
  }

  // In production, upload to Cloudinary
  const uploadResult = await cloudinary.uploader.upload(req.file.path, {
    resource_type: "image",
    folder: "press-play/coverImages",
    use_filename: true,
  });

  req.body.coverImageUrl = uploadResult.secure_url;
  req.body.cloudinary = uploadResult;
  return uploadResult;
}

async function deleteFile(path, resource_type) {
  // In development, skip Cloudinary delete (local files can stay)
  if (!isProduction) {
    return { result: "ok" };
  }

  const deleteResult = await cloudinary.uploader.destroy(path, {
    resource_type,
  });
  return deleteResult;
}

async function audioUpload(req, res) {
  requireAudio(req, res);

  // In development, use local file storage
  if (!isProduction) {
    const localUrl = `http://localhost:${process.env.PORT || 4000}/${req.file.path}`;
    req.body.episodeAudioUrl = localUrl;
    req.body.cloudinary = {
      public_id: req.file.filename,
      secure_url: localUrl,
      url: localUrl,
    };
    return { secure_url: localUrl, public_id: req.file.filename };
  }

  // In production, upload to Cloudinary
  const uploadResult = await cloudinary.uploader.upload(req.file.path, {
    resource_type: "video",
    folder: "press-play/audio",
    use_filename: true,
  });
  req.body.episodeAudioUrl = uploadResult.secure_url;
  req.body.cloudinary = uploadResult;
  return uploadResult;
}

exports.coverImageUpload = coverImageUpload;
exports.audioUpload = audioUpload;
exports.deleteFile = deleteFile;
