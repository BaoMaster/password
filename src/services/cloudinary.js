const cloudinary = require('cloudinary');

//Include your cloudinary credentials
cloudinary.config({
  cloud_name: 'dgkh9dr8a',
  api_key: '539967462261845',
  api_secret: '6HkIcImUyogu39HlYN4OhukuePQ',
});

exports.uploads = (file) => {
  return new Promise((resolve) => {
    cloudinary.uploader.upload(
      file,
      (result) => {
        resolve({ url: result.url, id: result.public_id });
      },
      { resource_type: 'auto' }
    );
  });
};
