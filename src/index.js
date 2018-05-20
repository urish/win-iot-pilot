const http = require('http');
const uwp = require('uwp');
uwp.projectNamespace('Windows');

const { DeviceInformation, DeviceClass } = Windows.Devices.Enumeration;
const { ImageEncodingProperties } = Windows.Media.MediaProperties;
const { ApplicationData, CreationCollisionOption } = Windows.Storage;
const {
  MediaCapture,
  MediaCaptureInitializationSettings,
} = Windows.Media.Capture;

let camera;
let mediaCapture;

async function initializeCamera() {
  const devices = await DeviceInformation.findAllAsync(
    DeviceClass.videoCapture,
  );
  camera = devices.getAt(0);
  if (camera) {
    const captureSettings = new MediaCaptureInitializationSettings({
      VideoDeviceId: camera.id,
    });
    mediaCapture = new MediaCapture();
    await mediaCapture.initializeAsync(captureSettings);
  }
}

async function captureImage() {
  const imageFile = await ApplicationData.current.localCacheFolder.createFileAsync(
    'pilot-camera.jpg',
    CreationCollisionOption.replaceExisting,
  );
  await mediaCapture.capturePhotoToStorageFileAsync(
    ImageEncodingProperties.createJpeg(),
    imageFile,
  );
}

let cameraError = null;
initializeCamera().catch(err => (cameraError = err));

http
  .createServer((req, res) => {
    res.end(`
      <html>
        <head>
          <title>Windows IoT Pilot</title>
        </head>
        <body>
          <h2>Welcome to IoT!</h2>
          <p>Camera: ${camera ? camera.name : '(none)'}
          <p>Camera error: <pre>${cameraError}</pre></p>
        </body>
      </html>
    `);
  })
  .listen(1280);
