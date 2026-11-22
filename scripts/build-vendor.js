const fs = require("node:fs");
const path = require("node:path");

const output = path.join(__dirname, "..", "assets", "vendor");
fs.mkdirSync(output, { recursive: true });

const assets = [
  ["three.min.js", "https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.min.js", 100000],
  ["GLTFLoader.js", "https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js", 10000],
  ["SkeletonUtils.js", "https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/utils/SkeletonUtils.js", 1000],
  ["THREE-LICENSE.txt", "https://cdn.jsdelivr.net/npm/three@0.128.0/LICENSE", 500]
];

async function download(name, url, minimumBytes) {
  const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
  if (!response.ok) throw new Error(`Download failed for ${name}: HTTP ${response.status}`);
  const data = Buffer.from(await response.arrayBuffer());
  if (data.length < minimumBytes) throw new Error(`Downloaded ${name} is unexpectedly small (${data.length} bytes)`);
  fs.writeFileSync(path.join(output, name), data);
  console.log(`Bundled ${name} (${data.length} bytes)`);
}

(async () => {
  for (const [name, url, minimumBytes] of assets) await download(name, url, minimumBytes);
})().catch(error => {
  console.error("ARTSPACE local 3D dependency build failed:", error);
  process.exitCode = 1;
});
