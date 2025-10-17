const ctx = new (window.AudioContext || window.webkitAudioContext)();
const stems = ['./Audio/Test_layer_1.mp3', './Audio/Test_layer_2.mp3', './Audio/Test_layer_3.mp3'];
let tracks = []; // { src, gain, buffer }
let animationTimer = null;

// safe decode helper: handles both promise and callback implementations
async function decodeAudioDataSafe(arrayBuffer) {
  try {
    return await ctx.decodeAudioData(arrayBuffer);
  } catch (err) {
    return await new Promise((resolve, reject) =>
      ctx.decodeAudioData(arrayBuffer, resolve, reject)
    );
  }
}

// preload & decode all stems in parallel
async function loadBuffers(urls) {
  const promises = urls.map(async (url) => {
    const res = await fetch(url);
    const ab = await res.arrayBuffer();
    return decodeAudioDataSafe(ab);
  });
  return Promise.all(promises);
}

// create a buffer source + gain and start it at the provided absolute AudioContext time
function createAndStartSource(buffer, startTime) {
  const src = ctx.createBufferSource();
  src.buffer = buffer;
  src.loop = true;

  const gain = ctx.createGain();
  // set an initial gain value *at the scheduled start time* so there's no click
  const initial = Math.random();
  gain.gain.setValueAtTime(initial, startTime);

  src.connect(gain).connect(ctx.destination);
  src.start(startTime);

  return { src, gain, buffer };
}

async function loadAndPlay() {
  const buffers = await loadBuffers(stems);

  // schedule everything to start at the same future time (give a small time for scheduling)
  const startTime = ctx.currentTime + 0.25; // 250ms look-ahead for reliability
  tracks = buffers.map(buf => createAndStartSource(buf, startTime));

  // start volume animation (or re-use previous, cancel if running)
  if (animationTimer) clearInterval(animationTimer);
  animateVolumes();
}

function animateVolumes() {
  // schedule smooth ramps every 2s; ramps themselves take 1s
  animationTimer = setInterval(() => {
    const now = ctx.currentTime;
    tracks.forEach(t => {
      const target = Math.random();

      // cancel any previously scheduled automation from 'now' onward,
      // set current value as a firm starting point, then ramp to target.
      t.gain.gain.cancelScheduledValues(now);
      // note: reading .value gives the AudioParam base/current value in practice;
      // if we have complex prior automation we might need more bookkeeping.
      t.gain.gain.setValueAtTime(t.gain.gain.value, now);
      t.gain.gain.linearRampToValueAtTime(target, now + 1);
    });
  }, 2000);
}

// make the button handler await resume before scheduling
document.querySelector('#start').addEventListener('click', async () => {
  await ctx.resume();        // ensure audio context is running
  if (!tracks.length) {
    loadAndPlay();
  } else {
    // already playing — optionally do nothing or recreate sources if you stopped them earlier
    console.log('already playing dummy!');
  }
});
