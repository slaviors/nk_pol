import ImageKit from 'imagekit';

const imagekit = new ImageKit({
  publicKey: process.env.IMGKIT_PUBLICKEY,
  privateKey: process.env.IMGKIT_PRIVATEKEY,
  urlEndpoint: process.env.IMGKIT_ENDPOINTURL
});

export default imagekit;