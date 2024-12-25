const mic = require("mic");
const PitchFinder = require("pitchfinder");

const micInstance = mic({
  rate: "44100",
  channels: "1",
  debug: true,
  device: "plughw:0,0",
  fileType: "raw", 
  bufferSize: 600, 
});

const detectPitch = PitchFinder.AMDF({
  sampleRate: 44100,
  threshold: 0.2,
});

const micInputStream = micInstance.getAudioStream();

function convertToFloat32(buffer) {
    const float32Array = new Float32Array(buffer.length / 2);
    for (let i = 0; i < buffer.length; i += 2) {
      float32Array[i / 2] = buffer.readInt16LE(i) / 32768; 
    }
    return float32Array;
  }


micInputStream.on("data", (data) => {

    const floatData = convertToFloat32(data);

  // Detect pitch
  const pitch = detectPitch(floatData);

  if (pitch) {
    // this will return the frequency of the note eg : C note frequency is 525 
    // do whatever you like with it's frequency
    console.log(pitch);
  } 
});

micInputStream.on("error", (error) => {
  console.error(error);
});

console.log("Listening.............");
micInstance.start();
